package com.booking.booking_ticket.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.booking.booking_ticket.dto.BookingDTO;
import com.booking.booking_ticket.dto.BookingSimpleDTO;
import com.booking.booking_ticket.entity.Booking;
import com.booking.booking_ticket.repository.BookingRepository;

@Service
public class BookingService {
    @Autowired
    private BookingRepository bookingRepository;

    public List<BookingDTO> getUserBooking(Integer userId){
        List<BookingDTO> bookings = bookingRepository.findBookingByUserId(userId);
        return bookings;
    }

    public List<BookingSimpleDTO> getByShowTimeId (Integer showTimeId){
        List<BookingSimpleDTO> bookingSimpleDTOs = bookingRepository.findBookingSimpleDTOByShowTimeId(showTimeId);
        return bookingSimpleDTOs;
    }
}
