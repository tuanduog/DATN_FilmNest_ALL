package com.booking.booking_ticket.config;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.JwtException;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationConverter;
import org.springframework.web.filter.OncePerRequestFilter;
import java.io.IOException;
import java.util.Arrays;

public class JwtCookieFilter extends OncePerRequestFilter {

    private final JwtDecoder jwtDecoder;
    private final JwtAuthenticationConverter converter;

    public JwtCookieFilter(JwtDecoder jwtDecoder, JwtAuthenticationConverter converter) {
        this.jwtDecoder = jwtDecoder;
        this.converter = converter;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                  HttpServletResponse response,
                                  FilterChain filterChain) throws ServletException, IOException {
        
        String path = request.getRequestURI();
        if (socketSkipFilter(path)) {
            filterChain.doFilter(request, response);
            return;
        }

        processJwtCookie(request);

        filterChain.doFilter(request, response);
    }

    private boolean socketSkipFilter(String path) {
        if (path.startsWith("/wsocket") || 
            path.startsWith("/sockjs") ||
            path.startsWith("/topic") ||
            path.startsWith("/app")) {
            return true;
        }

        for (String publicPath : SecurityConfig.PUBLIC_ENDPOINTS) {
            if (path.startsWith(publicPath)) {
                return true;
            }
        }

        return false;
    }

    private void processJwtCookie(HttpServletRequest request) {
        Cookie[] cookies = request.getCookies();
        if (cookies == null) return;

        Arrays.stream(cookies)
              .filter(c -> "jwt".equals(c.getName()))
              .findFirst()
              .ifPresent(cookie -> {
                  try {
                      Jwt jwt = jwtDecoder.decode(cookie.getValue());
                      Authentication auth = converter.convert(jwt);
                      SecurityContextHolder.getContext().setAuthentication(auth);
                  } catch (JwtException e) {
                      logger.warn("Invalid JWT token in cookie: " + e.getMessage());
                      SecurityContextHolder.clearContext();
                  }
              });
    }
}