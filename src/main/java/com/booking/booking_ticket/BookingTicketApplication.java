package com.booking.booking_ticket;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import java.beans.Encoder;

@SpringBootApplication
public class BookingTicketApplication {

	public static void main(String[] args) {
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
        System.out.println("PASSWORD: " + encoder.encode("123456"));
		SpringApplication.run(BookingTicketApplication.class, args);
	}

}
