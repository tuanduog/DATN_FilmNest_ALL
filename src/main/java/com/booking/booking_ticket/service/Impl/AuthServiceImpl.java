package com.booking.booking_ticket.service.Impl;

import com.booking.booking_ticket.dto.request.AuthRequestDTO;
import com.booking.booking_ticket.dto.request.RegisterRequestDTO;
import com.booking.booking_ticket.entity.InvalidToken;
import com.booking.booking_ticket.entity.Users;
import com.booking.booking_ticket.repository.InvalidTokenRepsitory;
import com.booking.booking_ticket.repository.UsersRepository;
import com.booking.booking_ticket.utils.UserRole;
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

    private final InvalidTokenRepsitory invalidTokenRepsitory;
    @NonFinal
    @Value("${jwt.signerKey}")
    protected String SIGNER_KEY;

    @Override
    public AuthResponse isAuthenticated(AuthRequestDTO authRequestDTO) {
        var account = usersRepository.findByUsername(authRequestDTO.getUsername()).orElseThrow();
        PasswordEncoder passwordEncoder = new BCryptPasswordEncoder(10);
        boolean isAuth = passwordEncoder.matches(authRequestDTO.getPassword(), account.getPassword());
        if (!isAuth) {
            log.error("unauthenticated !");
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
        if (account.getUserRole() == UserRole.CUSTOMER)
            role = "Customer";
        else
            role = account.getUserRole() == UserRole.MANAGER ? "Manager" : "Administrator";

        JWTClaimsSet claimsSet = new JWTClaimsSet.Builder()
                .claim("scope", role)
                .claim("user_id", account.getUserId())
                .claim("email", account.getEmail())
                .claim("phone_number", account.getPhone())
                .claim("membership", account.getMembership())
                .subject(account.getUsername())
                .issuer("BetaCineplex.com")
                .issueTime(new Date())
                .expirationTime(new Date(Instant.now().plus(1, ChronoUnit.HOURS).toEpochMilli()))
                .build();

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

        return IntrospectiveResponse.builder()
                .isValid(verified && !isExpired)
                .userId(((Number) jwt.getJWTClaimsSet().getClaim("user_id")).intValue())
                .username(jwt.getJWTClaimsSet().getSubject())
                .email((String) jwt.getJWTClaimsSet().getClaim("email"))
                .phoneNumber((String) jwt.getJWTClaimsSet().getClaim("phone_number"))
                .membership((String) jwt.getJWTClaimsSet().getClaim("membership"))
                .role((String) jwt.getJWTClaimsSet().getClaim("scope"))
                .build();
    }





    @Override
    public long registerCustomer(RegisterRequestDTO registerRequestDTO) {

        Users a = Users.builder()
                .username(registerRequestDTO.getUsername())
                .password(passwordEncoder.encode(registerRequestDTO.getPassword()))
                .email(registerRequestDTO.getEmail())
                .phone(registerRequestDTO.getPhone())
                .membership("no membership")
                .userRole(UserRole.CUSTOMER)
                .build();

        Users customer = usersRepository.save(a);

        return customer.getUserId();
    }

    @Override
    public boolean logout(HttpServletRequest request) {
        try {
            String token = Arrays.stream(Optional.ofNullable(request.getCookies()).orElse(new Cookie[0]))
                    .filter(c -> "jwt".equals(c.getName()))
                    .map(Cookie::getValue)
                    .findFirst()
                    .orElse(null);

            System.out.println(token);
            SignedJWT jwt = SignedJWT.parse(token);
            System.out.println(token);
            // var signToken = verifyToken(request.getToken(), true);
            // //Lấy body
            // String jit = signToken.getJWTClaimsSet().getJWTID();
            //
            // Date expiryTime = signToken.getJWTClaimsSet().getExpirationTime();

            // log.info("DATETIME: {}", expiryTime.toInstant());

            invalidTokenRepsitory.save(InvalidToken.builder()
                    .token_id(token)
                    .expired_at(jwt.getJWTClaimsSet().getExpirationTime().toInstant())
                    .build());
            return true;
        } catch (Exception e) {
            e.printStackTrace();
        }
        return false;
    }
}
