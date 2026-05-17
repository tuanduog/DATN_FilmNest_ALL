package com.booking.booking_ticket.controller;

import com.booking.booking_ticket.dto.response.ResponseData;
import com.booking.booking_ticket.service.ReportService;
import com.booking.booking_ticket.utils.ChartFilterType;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@Controller
@RestController
@RequiredArgsConstructor
@Slf4j
@RequestMapping("/api/report")
public class ReportController {

    private final ReportService reportService;

    @GetMapping("/v1/revenue/ticket")
    public ResponseData<?> getTicketChart(@RequestParam(required = false) Integer theaterId,
                                          @RequestParam(required = false) ChartFilterType filterType) {
        return new ResponseData<>(HttpStatus.OK.value(), "Get ticket chart successfully", reportService.getTicketChart(theaterId, filterType));
    }

    @GetMapping("/v1/revenue/structure")
    public ResponseData<?> getRevenueStructureChart(@RequestParam(required = false) Integer theaterId,
                                          @RequestParam(required = false) ChartFilterType filterType) {
        return new ResponseData<>(HttpStatus.OK.value(), "Get revenue structure chart successfully", reportService.getRevenueStructureChart(theaterId, filterType));
    }

    @GetMapping("/v1/revenue/movie")
    public ResponseData<?> getMovieChart(@RequestParam(required = false) Integer theaterId,
                                         @RequestParam(required = false) ChartFilterType filterType) {
        return new ResponseData<>(HttpStatus.OK.value(), "Get movie chart successfully", reportService.getMovieChart(theaterId, filterType));
    }

    @GetMapping("/v1/revenue/theater")
    public ResponseData<?> getTheaterChart(@RequestParam(required = false) ChartFilterType filterType) {
        return new ResponseData<>(HttpStatus.OK.value(), "Get theater chart successfully", reportService.getTheaterChart(filterType));
    }

    @GetMapping("/v1/revenue/room")
    public ResponseData<?> getRoomChart(@RequestParam(required = false) Integer theaterId,
                                        @RequestParam(required = false) ChartFilterType filterType) {
        return new ResponseData<>(HttpStatus.OK.value(), "Get room chart successfully", reportService.getRoomChart(theaterId, filterType));
    }

    @GetMapping("/v1/revenue/last-summary")
    public ResponseData<?> getSummaryLast(@RequestParam(required = false) Integer theaterId,
                                          @RequestParam(required = false) ChartFilterType filterType) {
        return new ResponseData<>(HttpStatus.OK.value(), "Get last summary successfully", reportService.getLastSummary(theaterId, filterType));
    }

    @GetMapping("/v1/showtime/today")
    public ResponseData<?> getShowTimeToday(@RequestParam(required = false) Integer theaterId) {
        return new ResponseData<>(HttpStatus.OK.value(), "Get show time successfully", reportService.getShowTimeToday(theaterId));
    }
}
