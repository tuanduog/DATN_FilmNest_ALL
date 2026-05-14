package com.booking.booking_ticket.controller;

import com.booking.booking_ticket.dto.BookingDTO;
import com.booking.booking_ticket.dto.response.*;
import com.booking.booking_ticket.dto.BookingSimpleDTO;
import com.booking.booking_ticket.entity.Booking;
import com.booking.booking_ticket.repository.BookingRepository;
import com.booking.booking_ticket.service.BookingService;
import com.booking.booking_ticket.utils.PaymentStatus;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

@Controller
@RestController
@RequiredArgsConstructor
@Slf4j
@RequestMapping("/booking")
public class BookingController {

    private final BookingService bookingService;

    private final BookingRepository bookingRepository;

    @Autowired
    private RedisTemplate<String, String> redisTemplate;

    @PostMapping("/add-booking")
    public ResponseEntity<?> addBooking(@RequestBody Booking booking) {
        try {
            String[] newChairs = booking.getChair().split(",");
            List<Booking> existingBookings = bookingRepository.findByShowTime_Id(
                    booking.getShowTime().getId());

            for (Booking existing : existingBookings) {
                String[] bookedChairs = existing.getChair().split(",");

                for (String c1 : newChairs) {
                    for (String c2 : bookedChairs) {
                        if (c1.trim().equalsIgnoreCase(c2.trim())) {
                            return ResponseEntity.status(HttpStatus.CONFLICT)
                                    .body("Chair " + c1.trim() + " already booked.");
                        }
                    }
                }
            }
            booking.setCode(generateBookingCode());

            Booking saved = bookingRepository.save(booking);
            return ResponseEntity.ok(saved);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to save booking: " + e.getMessage());
        }
    }

    private String generateBookingCode() {
        String datePart = java.time.LocalDate.now()
                .format(java.time.format.DateTimeFormatter.ofPattern("yyyyMMdd"));

        String randomPart = String.valueOf((int) (Math.random() * 9000) + 1000);

        return "BK" + datePart + randomPart;
    }

    @GetMapping("/check-booking")
    public ResponseEntity<?> checkBooking(
            @RequestParam Integer userId,
            @RequestParam Integer showTimeId,
            @RequestParam String chair) {
        try {
            String[] requestedChairs = chair.split(",");

            List<Booking> bookings = bookingRepository.findByShowTime_Id(showTimeId);

            for (Booking booking : bookings) {
                String[] bookedChairs = booking.getChair().split(",");

                for (String req : requestedChairs) {
                    for (String booked : bookedChairs) {
                        if (req.trim().equalsIgnoreCase(booked.trim())) {
                            return ResponseEntity.ok(true);
                        }
                    }
                }
            }

            return ResponseEntity.ok(false);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error checking booking: " + e.getMessage());
        }
    }

    @GetMapping("/get-userbooking/{userId}")
    public ResponseEntity<?> getUserBooking(@PathVariable Integer userId) {
        try {
            List<BookingDTO> bookings = bookingService.getUserBooking(userId);
            return ResponseEntity.ok(bookings);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to save booking: " + e.getMessage());
        }
    }

    @GetMapping("/get-data-for-line-chart")
    public ResponseData<LineChartResponse> getProductMultipleSearchCol(@RequestParam String filter) {
        LineChartResponse lc = null;
        if(filter.equalsIgnoreCase("Year"))
        {
             lc = LineChartResponse.builder()
                    .a_cus(bookingService.getCustomersThisyear())
                    .revenue(bookingService.getRevenueThisYear())
                    .build();
        }else if(filter.equalsIgnoreCase("month")){
             lc = LineChartResponse.builder()
                    .a_cus(bookingService.getCustomersThisMonth())
                    .revenue(bookingService.getRevenueThisMonth())
                    .build();
        }

        try{
            return new ResponseData<>(HttpStatus.OK.value(),"User found!",lc);
        }
        catch (Exception e)
        {
            log.error("there is an error : {}",e.getMessage());
            return new ResponseError(HttpStatus.BAD_REQUEST.value(), e.getMessage());
        }
    }

    @GetMapping("/stats")
    public ResponseEntity<?> getBookingStats(@RequestParam int year) {
        Map<String, List<Number>> chartData = bookingService.getMonthlyChartData(year);
        return ResponseEntity.ok(chartData);
    }

    @GetMapping("/stats-monthly")
    public ResponseEntity<?> getBookingStatsMonthly(@RequestParam int month) {
        Map<String, List<Number>> chartData = bookingService.getYearlyChartData(month);
        return ResponseEntity.ok(chartData);
    }

    @GetMapping("/bookings-by-category")
    public ResponseEntity<List<Map<String, Object>>> getBookingStatsByCategory() {
        List<BookingByCategoryStats> stats = bookingService.getBookingStatsByCategory();

        // Convert sang format ECharts pie: [{name, value}]
        List<Map<String, Object>> result = stats.stream().map(stat -> {
            Map<String, Object> map = new HashMap<>();
            map.put("name", stat.getCategory());
            map.put("value", stat.getTotal());
            return map;
        }).collect(Collectors.toList());

        return ResponseEntity.ok(result);
    }

    @GetMapping("/responses")
    public ResponseEntity<List<BookingResponse>> getAllBookingResponses() {
        return ResponseEntity.ok(bookingService.getAllBookingResponses());
    }

    @GetMapping("/get-byshowtime/{showTimeId}")
    public ResponseEntity<?> getBookingByShowTime(@PathVariable Integer showTimeId) {
        try {
            List<BookingSimpleDTO> bookings = bookingService.getByShowTimeId(showTimeId);
            return ResponseEntity.ok(bookings);
        } catch (Exception e){
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
            .body("Failed to getbooking byshowtime: " + e.getMessage());
        }
    }

    @GetMapping("/seats-locking/{movieId}/{showTimeId}/{date}")
    public ResponseEntity<?> getLockedSeats(@PathVariable Integer movieId, @PathVariable Integer showTimeId, @PathVariable String date) {
        try {
            String redisKey = "seatLock:" + movieId + ":" + showTimeId + ":" + date;
            Map<Object, Object> lockedSeats = redisTemplate.opsForHash().entries(redisKey);

            return ResponseEntity.ok(lockedSeats);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to get locked seats: " + e.getMessage());
        }
    }

    @GetMapping("/v1")
    public ResponseData<?> getList(@PageableDefault() Pageable pageable,
                                   @RequestParam(required = false) String keyword,
                                   @RequestParam(required = false) PaymentStatus paymentStatus,
                                   @RequestParam(required = false) LocalDate startDate,
                                   @RequestParam(required = false) LocalDate endDate) {
        return new ResponseData<>(HttpStatus.OK.value(), "Get list successful", bookingService.getList(pageable, keyword, paymentStatus, startDate, endDate));
    }

    @GetMapping("/v1/{id}")
    public ResponseData<?> getById(@PathVariable Integer id) {
        return new ResponseData<>(HttpStatus.OK.value(), "Get order successful", bookingService.getById(id));
    }

    @GetMapping("/v1/theater/{id}")
    public ResponseData<?> getListByTheaterId(
                                   @PathVariable Integer id,
                                   @PageableDefault() Pageable pageable,
                                   @RequestParam(required = false) String keyword,
                                   @RequestParam(required = false) PaymentStatus paymentStatus,
                                   @RequestParam(required = false) LocalDate startDate,
                                   @RequestParam(required = false) LocalDate endDate) {
        return new ResponseData<>(HttpStatus.OK.value(), "Get list successful", bookingService.getListByTheaterId(id, pageable, keyword, paymentStatus, startDate, endDate));
    }
}
