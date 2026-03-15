package com.booking.booking_ticket.service;


import java.util.List;
import java.util.Map;

public interface BookingsService {


    public Double getRevenueThisMonth();
    public Long getCustomersThisMonth();
    public Long getCustomersThisyear();
    public Double getRevenueThisYear();
    Map<String, List<Number>> getMonthlyChartData(int year);

    Map<String, List<Number>> getYearlyChartData(int month);



}
