package com.booking.booking_ticket.controller;

import com.booking.booking_ticket.dto.request.AuthRequest;
import com.booking.booking_ticket.dto.request.RegisterRequest;
import com.booking.booking_ticket.dto.response.AuthResponse;
import com.booking.booking_ticket.dto.response.IntrospectiveResponse;
import com.booking.booking_ticket.dto.response.ResponseData;
import com.booking.booking_ticket.dto.response.ResponseError;

import com.booking.booking_ticket.service.Impl.AuthServiceImpl;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.time.Duration;

@Controller
@RestController
@RequiredArgsConstructor
@Slf4j
@RequestMapping("/auth")
public class AuthController {

    private final AuthServiceImpl authService;

    private final AuthServiceImpl authServiceImpl;

    @PostMapping("/login")
    public ResponseData<AuthResponse> login(@RequestBody AuthRequest authRequest, HttpServletResponse response) {
        try {
            var result = authService.isAuthenticated(authRequest);
            if (result.getIsAuthenticated() == true) {
                ResponseCookie cookie = ResponseCookie.from("jwt", result.getToken())
                        .httpOnly(true)
                        .secure(false)
                        .path("/")
                        .maxAge(Duration.ofHours(1))
                        .build();
                System.out.println(cookie.toString());
                response.setHeader(HttpHeaders.SET_COOKIE, cookie.toString());

                return new ResponseData<>(HttpStatus.OK.value(), "User authenticated", result);
            } else
                return new ResponseError(HttpStatus.BAD_REQUEST.value(), "wrong username or password");
        } catch (Exception e) {
            log.error("there is an error : {}", e.getMessage());
            return new ResponseError(HttpStatus.BAD_REQUEST.value(), e.getMessage());
        }
    }

    @GetMapping("/introspect")
    public ResponseData<IntrospectiveResponse> verify(HttpServletRequest request) {
        try {
            IntrospectiveResponse result = authServiceImpl.introspect(request);
            if (result.getIsValid()) {
                // Token hợp lệ → trả thông tin user + role
                return new ResponseData<>(
                        HttpStatus.OK.value(),
                        "Token valid",
                        result);
            } else {
                // Token không hợp lệ
                return new ResponseError(
                        HttpStatus.UNAUTHORIZED.value(),
                        "Token invalid or expired");
            }
        } catch (Exception e) {
            log.error("there is an error of introspect: {}", e.getMessage());
            return new ResponseError(HttpStatus.BAD_REQUEST.value(), e.getMessage());
        }
    }

    @PostMapping("/register")
    public ResponseData<Long> login(@RequestBody RegisterRequest registerRequest) {
        try {
            authService.registerCustomer(registerRequest);
            return new ResponseData<>(HttpStatus.OK.value(), "Register successful!");
        } catch (Exception e) {
            return new ResponseError(HttpStatus.BAD_REQUEST.value(), e.getMessage());
        }
    }

    @PostMapping("/logout")
    public ResponseData<Boolean> logout(HttpServletRequest request, HttpServletResponse response) {
        try {
            boolean result = authService.logout(request);

            Cookie cookie = new Cookie("jwt", null);
            cookie.setPath("/");
            cookie.setHttpOnly(true);
            cookie.setMaxAge(0);
            response.addCookie(cookie);
            return new ResponseData<>(HttpStatus.OK.value(), "Logout!", result);
        } catch (Exception e) {
            log.error("there is an error : {}", e.getMessage());
            return new ResponseError(HttpStatus.BAD_REQUEST.value(), e.getMessage());
        }
    }
}
