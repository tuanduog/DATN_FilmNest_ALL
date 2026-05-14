package com.booking.booking_ticket.service;


import com.booking.booking_ticket.dto.BookingDTO;
import com.booking.booking_ticket.dto.BookingSimpleDTO;
import com.booking.booking_ticket.dto.response.BookingResponse;
import com.booking.booking_ticket.dto.response.OrderResponse;
import com.booking.booking_ticket.utils.PaymentStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.time.LocalDate;
import java.util.List;

public interface BookingService {

    public List<BookingDTO> getUserBooking(Integer userId);

    public List<BookingSimpleDTO> getByShowTimeId(Integer showTimeId);

    public List<BookingResponse> getAllBookingResponses();

    public Page<OrderResponse> getList(Pageable pageable, String keyword, PaymentStatus paymentStatus, LocalDate startDate, LocalDate endDate);

    public OrderResponse getById(Integer id);

    public Page<OrderResponse> getListByTheaterId(Integer theaterId, Pageable pageable, String keyword, PaymentStatus paymentStatus, LocalDate startDate, LocalDate endDate);
}
