package com.booking.booking_ticket.service;


import com.booking.booking_ticket.dto.BookingDTO;
import com.booking.booking_ticket.dto.BookingSimpleDTO;
import com.booking.booking_ticket.dto.response.BookingByCategoryStats;
import com.booking.booking_ticket.dto.response.BookingResponse;

import java.util.List;
import java.util.Map;

public interface BookingService {

    public List<BookingDTO> getUserBooking(Integer userId);

    public List<BookingSimpleDTO> getByShowTimeId(Integer showTimeId);

    public Double getRevenueThisMonth();

    public Long getCustomersThisMonth();

    public Long getCustomersThisyear();

    public Double getRevenueThisYear();

    Map<String, List<Number>> getMonthlyChartData(int year);

    Map<String, List<Number>> getYearlyChartData(int month);

    public List<BookingByCategoryStats> getBookingStatsByCategory();

    public List<BookingResponse> getAllBookingResponses();
}
