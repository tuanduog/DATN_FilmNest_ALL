package com.booking.booking_ticket.service.Impl;

import com.booking.booking_ticket.service.MailService;
import lombok.RequiredArgsConstructor;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class MailServiceImpl implements MailService {

    private final JavaMailSender mailSender;

    @Override
    @Async
    public void sendCreateAccountMail (String email, String username, String password) {
        SimpleMailMessage message = new SimpleMailMessage();

        message.setTo(email);
        message.setSubject("Tài khoản đăng nhập FilmNest");
        message.setText("""
                Xin chào,

                Tài khoản FilmNest của bạn đã được tạo thành công.

                Tài khoản: %s
                Mật khẩu: %s

                Vui lòng đổi mật khẩu sau khi đăng nhập.

                Trân trọng,
                FilmNest
                """.formatted(username, password));

        mailSender.send(message);
    }
}
