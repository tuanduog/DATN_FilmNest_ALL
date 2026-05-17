package com.booking.booking_ticket.service;

import com.booking.booking_ticket.dto.response.*;
import com.booking.booking_ticket.utils.ChartFilterType;

import java.util.List;

public interface ReportService {

    public List<TicketReportResponse> getTicketChart(Integer theaterId, ChartFilterType filterType);

    public List<StructureRevenueResponse> getRevenueStructureChart(Integer theaterId, ChartFilterType filterType);

    public List<MovieReportResponse> getMovieChart(Integer theaterId, ChartFilterType filterType);

    public List<OccupancyReportResponse> getTheaterChart(ChartFilterType filterType);

    public List<OccupancyReportResponse> getRoomChart(Integer theaterId, ChartFilterType filterType);

    public LastSummaryResponse getLastSummary(Integer theaterId, ChartFilterType filterType);

    public List<ShowTimeTodayResponse> getShowTimeToday(Integer theaterId);
}
