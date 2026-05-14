package com.booking.booking_ticket.service.Impl;

import com.booking.booking_ticket.dto.request.AuthRequest;
import com.booking.booking_ticket.dto.request.RegisterRequest;
import com.booking.booking_ticket.entity.InvalidToken;
import com.booking.booking_ticket.entity.Users;
import com.booking.booking_ticket.entity.Employee;
import com.booking.booking_ticket.repository.EmployeeRepository;
import com.booking.booking_ticket.repository.InvalidTokenRepsitory;
import com.booking.booking_ticket.repository.UsersRepository;
import com.booking.booking_ticket.utils.Role;
import com.booking.booking_ticket.utils.Status;
import com.booking.booking_ticket.utils.Util;
import com.nimbusds.jose.*;
import com.nimbusds.jose.crypto.MACSigner;
import com.nimbusds.jose.crypto.MACVerifier;
import com.nimbusds.jwt.JWTClaimsSet;
import com.nimbusds.jwt.SignedJWT;
import com.booking.booking_ticket.dto.response.AuthResponse;
import com.booking.booking_ticket.dto.response.IntrospectiveResponse;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.experimental.NonFinal;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import com.booking.booking_ticket.service.AuthService;

import java.text.ParseException;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Arrays;
import java.util.Date;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthServiceImpl implements AuthService {

    private final UsersRepository usersRepository;

    private final PasswordEncoder passwordEncoder;

    private final EmployeeRepository employeeRepository;

    private final Util util;

    private final InvalidTokenRepsitory invalidTokenRepsitory;
    @NonFinal
    @Value("${jwt.signerKey}")
    protected String SIGNER_KEY;

    @Override
    public AuthResponse isAuthenticated(AuthRequest request) {
        Users account = usersRepository.findByUsername(request.getUsername()).orElseThrow(() -> new RuntimeException("Username does not exist"));
        PasswordEncoder passwordEncoder = new BCryptPasswordEncoder(10);
        boolean isAuth = passwordEncoder.matches(request.getPassword(), account.getPassword());

        if (account.getStatus() == null || account.getStatus().equals(Status.INACTIVE)){
            isAuth = false;
        }

        if (!isAuth) {
            return AuthResponse.builder()
                    .token(null)
                    .isAuthenticated(false)
                    .build();
        }
        var token = generateToken(account);
        return AuthResponse.builder()
                .token(token)
                .isAuthenticated(true)
                .build();
    }

    @Override
    public String generateToken(Users account) {
        JWSHeader jwsHeader = new JWSHeader(JWSAlgorithm.HS512);
        String role;
        if (account.getRole() == Role.USER)
            role = "User";
        else if (account.getRole() == Role.MANAGER)
            role = "Manager";
        else if (account.getRole() == Role.ADMINISTRATOR)
            role = "Admin";
        else role = "Staff";

        JWTClaimsSet.Builder claimsBuilder = new JWTClaimsSet.Builder()
                .claim("scope", role)
                .claim("user_id", account.getId())
                .claim("email", account.getEmail())
                .claim("phone_number", account.getPhone())
                .subject(account.getUsername())
                .issueTime(new Date())
                .expirationTime(new Date(Instant.now().plus(1, ChronoUnit.HOURS).toEpochMilli()));

        if (account.getRole() == Role.MANAGER || account.getRole() == Role.STAFF) {
            Optional<Employee> empOpt = employeeRepository.findByUser_Id(account.getId());
            empOpt.ifPresent(employee -> {
                if (employee.getTheater() != null) {
                    claimsBuilder.claim("theater_id", employee.getTheater().getId());
                }
            });
        }

        JWTClaimsSet claimsSet = claimsBuilder.build();

        Payload payload = new Payload(claimsSet.toJSONObject());

        JWSObject jwsObject = new JWSObject(jwsHeader, payload);

        try {
            jwsObject.sign(new MACSigner(SIGNER_KEY.getBytes()));
            return jwsObject.serialize();
        } catch (Exception e) {
            log.error("Cannot create token error: {}", e.getMessage());
            throw new RuntimeException(e);
        }
    }

    @Override
    public IntrospectiveResponse introspect(HttpServletRequest request) throws JOSEException, ParseException {
        String token = Arrays.stream(Optional.ofNullable(request.getCookies()).orElse(new Cookie[0]))
                .filter(c -> "jwt".equals(c.getName()))
                .map(Cookie::getValue)
                .findFirst()
                .orElse(null);

        if (token == null)
            return IntrospectiveResponse.builder().isValid(false).build();

        // Kiểm tra token có trong danh sách bị vô hiệu
        Optional<InvalidToken> optionalInvalid = invalidTokenRepsitory.findById(token);
        boolean isBlacklisted = false;

        if (optionalInvalid.isPresent()) {
            SignedJWT parsedJwt = SignedJWT.parse(token);
            Date expiration = parsedJwt.getJWTClaimsSet().getExpirationTime();
            isBlacklisted = expiration.toInstant().equals(optionalInvalid.get().getExpired_at());
        }

        if (isBlacklisted)
            return IntrospectiveResponse.builder().isValid(false).build();

        SignedJWT jwt = SignedJWT.parse(token);
        JWSVerifier verifier = new MACVerifier(SIGNER_KEY.getBytes());
        boolean verified = jwt.verify(verifier);

        Date expirationTime = jwt.getJWTClaimsSet().getExpirationTime();
        boolean isExpired = expirationTime.before(new Date());

        Integer theaterId = null;
        Object theaterIdClaim = jwt.getJWTClaimsSet().getClaim("theater_id");
        if (theaterIdClaim != null) {
            theaterId = ((Number) theaterIdClaim).intValue();
        }

        return IntrospectiveResponse.builder()
                .isValid(verified && !isExpired)
                .userId(((Number) jwt.getJWTClaimsSet().getClaim("user_id")).intValue())
                .username(jwt.getJWTClaimsSet().getSubject())
                .email((String) jwt.getJWTClaimsSet().getClaim("email"))
                .phoneNumber((String) jwt.getJWTClaimsSet().getClaim("phone_number"))
                .membership((String) jwt.getJWTClaimsSet().getClaim("membership"))
                .role((String) jwt.getJWTClaimsSet().getClaim("scope"))
                .theaterId(theaterId)
                .build();
    }

    @Override
    public void register(RegisterRequest request) {
        util.validateUser(request.getUsername(), request.getEmail(), request.getPhone(), null);
        Users user = new Users();
        user.setUsername(request.getUsername());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setEmail(request.getEmail());
        user.setPhone(request.getPhone());
        user.setRole(Role.USER);
        user.setStatus(Status.ACTIVE);

        usersRepository.save(user);
    }

    @Override
    public boolean logout(HttpServletRequest request) {
        try {
            String token = Arrays.stream(Optional.ofNullable(request.getCookies()).orElse(new Cookie[0]))
                    .filter(c -> "jwt".equals(c.getName()))
                    .map(Cookie::getValue)
                    .findFirst()
                    .orElse(null);

            SignedJWT jwt = SignedJWT.parse(token);

            InvalidToken invalidToken = new InvalidToken();
            invalidToken.setToken_id(token);
            invalidToken.setExpired_at(jwt.getJWTClaimsSet().getExpirationTime().toInstant());

            invalidTokenRepsitory.save(invalidToken);
            return true;
        } catch (Exception e) {
            e.printStackTrace();
        }
        return false;
    }
}
