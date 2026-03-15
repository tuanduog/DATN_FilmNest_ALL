package com.booking.booking_ticket.controller;


import com.booking.booking_ticket.dto.BookingDTO;
import com.booking.booking_ticket.dto.response.*;
import com.booking.booking_ticket.dto.BookingSimpleDTO;
import com.booking.booking_ticket.entity.Booking;
import com.booking.booking_ticket.repository.BookingRepository;
import com.booking.booking_ticket.service.BookingService;
import com.booking.booking_ticket.service.Impl.BookingServiceImpl;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.cache.CacheProperties.Redis;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

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
@CrossOrigin(origins = "http://localhost:5173")
public class BookingController {

    public final BookingServiceImpl bookingService;

    private final BookingService bookingService1;

    private final BookingRepository bookingRepository;

    @Autowired
    private RedisTemplate<String, String> redisTemplate;

    @PostMapping("/add-booking")
    public ResponseEntity<?> addBooking(@RequestBody Booking booking) {
        try {
            String[] newChairs = booking.getChair().split(",");
            List<Booking> existingBookings = bookingRepository.findByShowTime_ShowTimeId(
                    booking.getShowTime().getShowTimeId());

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

            Booking saved = bookingRepository.save(booking);
            return ResponseEntity.ok(saved);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to save booking: " + e.getMessage());
        }
    }

    @GetMapping("/check-booking")
    public ResponseEntity<?> checkBooking(
            @RequestParam Integer userId,
            @RequestParam Integer showTimeId,
            @RequestParam String chair) {
        try {
            String[] requestedChairs = chair.split(",");

            List<Booking> bookings = bookingRepository.findByShowTime_ShowTimeId(showTimeId);

            for (Booking booking : bookings) {
                String[] bookedChairs = booking.getChair().split(",");

                for (String req : requestedChairs) {
                    for (String booked : bookedChairs) {
                        if (req.trim().equalsIgnoreCase(booked.trim())) {
                            // Nếu tìm thấy ghế bị trùng → trả về true
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
            List<BookingDTO> bookings = bookingService1.getUserBooking(userId);
            return ResponseEntity.ok(bookings);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to save booking: " + e.getMessage());
        }
    }
    @GetMapping("/get-data-for-line-chart")
    public ResponseData<LineChartDTOResponse> getProductMultipleSearchCol(@RequestParam String filter) {
        LineChartDTOResponse l_c = null;
        if(filter.equalsIgnoreCase("Year"))
        {
             l_c = LineChartDTOResponse.builder()
                    .a_cus(bookingService.getCustomersThisyear())
                    .revenue(bookingService.getRevenueThisYear())
                    .build();
        }else if(filter.equalsIgnoreCase("month")){
             l_c = LineChartDTOResponse.builder()
                    .a_cus(bookingService.getCustomersThisMonth())
                    .revenue(bookingService.getRevenueThisMonth())
                    .build();
        }

        try{
            return new ResponseData<>(HttpStatus.OK.value(),"User found!",l_c);
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
            List<BookingSimpleDTO> bookings = bookingService1.getByShowTimeId(showTimeId);
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
    
}
