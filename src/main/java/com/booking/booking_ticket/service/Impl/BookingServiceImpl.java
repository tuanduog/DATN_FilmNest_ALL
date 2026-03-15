package com.booking.booking_ticket.service.Impl;

import com.booking.booking_ticket.dto.response.BookingByCategoryStats;
import com.booking.booking_ticket.dto.response.BookingResponse;
import com.booking.booking_ticket.repository.BookingRepository;
import com.booking.booking_ticket.service.BookingsService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class BookingServiceImpl implements BookingsService {

    private final BookingRepository bookingRepository;
    @Override
    public Double getRevenueThisMonth() {
        return bookingRepository.getCurrentMonthRevenue();
    }

    @Override
    public Long getCustomersThisMonth() {
        return bookingRepository.getCurrentMonthCustomersAmount();
    }

    @Override
    public Double getRevenueThisYear() {
        return bookingRepository.getCurrentYearRevenue();
    }

    @Override
    public Long getCustomersThisyear() {
        return bookingRepository.countBookingsThisYear();
    }

    @Override
    public Map<String, List<Number>> getMonthlyChartData(int year) {
        List<Object[]> result = bookingRepository.findMonthlyBookingStats(year);

        // Khởi tạo mảng mặc định cho đủ 12 tháng
        Integer[] bookings = new Integer[12];
        Double[] revenues = new Double[12];

        Arrays.fill(bookings, 0);
        Arrays.fill(revenues, 0.0);

        for (Object[] row : result) {
            int month = (int) row[0]; // tháng từ 1 → 12
            int totalBookings = ((Number) row[1]).intValue();
            double totalRevenue = ((Number) row[2]).doubleValue();

            bookings[month ] = totalBookings;
            revenues[month ] = totalRevenue;
        }

        Map<String, List<Number>> data = new HashMap<>();
        data.put("bookings", Arrays.asList(bookings));
        data.put("revenues", Arrays.asList(revenues));
        return data;
    }
    @Override
    public Map<String, List<Number>> getYearlyChartData(int year) {
        List<Object[]> result = bookingRepository.findYearlyBookingStats(year);
        System.out.println(result.size());
        // Khởi tạo mảng mặc định cho đủ 12 tháng
        Integer[] bookings = new Integer[32];
        Double[] revenues = new Double[32];

        Arrays.fill(bookings, 0);
        Arrays.fill(revenues, 0.0);

        for (Object[] row : result) {
            int month = (int) row[0]; // ngay từ 1 → 30
            int totalBookings = ((Number) row[1]).intValue();
            double totalRevenue = ((Number) row[2]).doubleValue();

            bookings[month ] = totalBookings;
            revenues[month ] = totalRevenue;
        }

        Map<String, List<Number>> data = new HashMap<>();
        data.put("bookings", Arrays.asList(bookings));
        data.put("revenues", Arrays.asList(revenues));
        return data;
    }
    public List<BookingByCategoryStats> getBookingStatsByCategory() {
        return bookingRepository.countBookingsByMovieCategory();
    }
    public List<BookingResponse> getAllBookingResponses() {
        return bookingRepository.getAllBookingResponse();
    }
}
