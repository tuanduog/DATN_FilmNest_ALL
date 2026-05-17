package com.booking.booking_ticket.service.Impl;

import com.booking.booking_ticket.dto.response.*;
import com.booking.booking_ticket.repository.BookingRepository;
import com.booking.booking_ticket.repository.ShowTimeRepository;
import com.booking.booking_ticket.service.ReportService;
import com.booking.booking_ticket.utils.ChartFilterType;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class ReportServiceImpl implements ReportService {

    private final BookingRepository bookingRepository;

    private final ShowTimeRepository showTimeRepository;

    @Override
    public List<TicketReportResponse> getTicketChart(Integer theaterId, ChartFilterType filterType) {
        LocalDate today = LocalDate.now();

        LocalDateTime startTime;
        LocalDateTime endTime = LocalDateTime.now();

        if (filterType.equals(ChartFilterType.TODAY)) {
            startTime = today.atStartOfDay();
        } else if (filterType.equals(ChartFilterType.WEEK)) {
            startTime = today.with(DayOfWeek.MONDAY).atStartOfDay();
        } else if (filterType.equals(ChartFilterType.MONTH)) {
            startTime = today.withDayOfMonth(1).atStartOfDay();
        } else if (filterType.equals(ChartFilterType.YEAR)) {
            startTime = today.withDayOfYear(1).atStartOfDay();
        } else {
            throw new IllegalArgumentException("Invalid filter type");
        }

        return bookingRepository.getTicketChart(theaterId, startTime, endTime, filterType);
    }

    @Override
    public List<StructureRevenueResponse> getRevenueStructureChart(Integer theaterId, ChartFilterType filterType){
        LocalDate today = LocalDate.now();

        LocalDateTime startTime;
        LocalDateTime endTime = LocalDateTime.now();

        if (filterType.equals(ChartFilterType.TODAY)) {
            startTime = today.atStartOfDay();
        } else if (filterType.equals(ChartFilterType.WEEK)) {
            startTime = today.with(DayOfWeek.MONDAY).atStartOfDay();
        } else if (filterType.equals(ChartFilterType.MONTH)) {
            startTime = today.withDayOfMonth(1).atStartOfDay();
        } else if (filterType.equals(ChartFilterType.YEAR)) {
            startTime = today.withDayOfYear(1).atStartOfDay();
        } else {
            throw new IllegalArgumentException("Invalid filter type");
        }

        return bookingRepository.getRevenueStructureChart(theaterId, startTime, endTime);
    }

    @Override
    public List<MovieReportResponse> getMovieChart(Integer theaterId, ChartFilterType filterType) {
        LocalDate today = LocalDate.now();
        LocalDateTime endTime = LocalDateTime.now();
        LocalDateTime startTime;

        if (filterType.equals(ChartFilterType.TODAY)) {
            startTime = today.atStartOfDay();
        } else if (filterType.equals(ChartFilterType.WEEK)) {
            startTime = today.with(DayOfWeek.MONDAY).atStartOfDay();
        } else if (filterType.equals(ChartFilterType.MONTH)) {
            startTime = today.withDayOfMonth(1).atStartOfDay();
        } else if (filterType.equals(ChartFilterType.YEAR)) {
            startTime = today.withDayOfYear(1).atStartOfDay();
        } else {
            throw new IllegalArgumentException("Invalid filter type");
        }

        return bookingRepository.getMovieChart(theaterId, startTime, endTime);
    }

    @Override
    public List<OccupancyReportResponse> getTheaterChart(ChartFilterType filterType) {
        LocalDate today = LocalDate.now();
        LocalDateTime endTime = LocalDateTime.now();
        LocalDateTime startTime;

        if (filterType.equals(ChartFilterType.TODAY)) {
            startTime = today.atStartOfDay();
        } else if (filterType.equals(ChartFilterType.WEEK)) {
            startTime = today.with(DayOfWeek.MONDAY).atStartOfDay();
        } else if (filterType.equals(ChartFilterType.MONTH)) {
            startTime = today.withDayOfMonth(1).atStartOfDay();
        } else if (filterType.equals(ChartFilterType.YEAR)) {
            startTime = today.withDayOfYear(1).atStartOfDay();
        } else {
            throw new IllegalArgumentException("Invalid filter type");
        }

        return bookingRepository.getTheaterChart(startTime, endTime);
    }

    @Override
    public List<OccupancyReportResponse> getRoomChart(Integer theaterId, ChartFilterType filterType) {
        LocalDate today = LocalDate.now();
        LocalDateTime endTime = LocalDateTime.now();
        LocalDateTime startTime;

        if (filterType.equals(ChartFilterType.TODAY)) {
            startTime = today.atStartOfDay();
        } else if (filterType.equals(ChartFilterType.WEEK)) {
            startTime = today.with(DayOfWeek.MONDAY).atStartOfDay();
        } else if (filterType.equals(ChartFilterType.MONTH)) {
            startTime = today.withDayOfMonth(1).atStartOfDay();
        } else if (filterType.equals(ChartFilterType.YEAR)) {
            startTime = today.withDayOfYear(1).atStartOfDay();
        } else {
            throw new IllegalArgumentException("Invalid filter type");
        }

        return bookingRepository.getRoomChart(theaterId, startTime, endTime);
    }

    @Override
    public LastSummaryResponse getLastSummary (Integer theaterId, ChartFilterType filterType) {
        LocalDate today = LocalDate.now();
        LocalDateTime endTime = LocalDateTime.now();
        LocalDateTime startTime;

        if (filterType.equals(ChartFilterType.TODAY)) {
            startTime = today.atStartOfDay().minusDays(1);
            endTime = endTime.minusDays(1);
        } else if (filterType.equals(ChartFilterType.WEEK)) {
            startTime = today.with(DayOfWeek.MONDAY).atStartOfDay().minusWeeks(1);
            endTime = endTime.minusWeeks(1);
        } else if (filterType.equals(ChartFilterType.MONTH)) {
            startTime = today.withDayOfMonth(1).atStartOfDay().minusMonths(1);
            endTime = endTime.minusMonths(1);
        } else if (filterType.equals(ChartFilterType.YEAR)) {
            startTime = today.withDayOfYear(1).atStartOfDay().minusYears(1);
            endTime = endTime.minusYears(1);
        } else {
            throw new IllegalArgumentException("Invalid filter type");
        }

        if (theaterId != null) {
            return bookingRepository.getManagerLastSummary(theaterId, startTime, endTime);
        } else {
            return bookingRepository.getAdminLastSummary(startTime, endTime);
        }
    }

    public List<ShowTimeTodayResponse> getShowTimeToday(Integer theaterId) {
        return showTimeRepository.findAllShowTimeToday(theaterId);
    }
}
