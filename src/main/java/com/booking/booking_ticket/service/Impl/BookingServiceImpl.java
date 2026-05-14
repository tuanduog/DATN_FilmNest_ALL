package com.booking.booking_ticket.service.Impl;

import com.booking.booking_ticket.dto.BookingDTO;
import com.booking.booking_ticket.dto.BookingSimpleDTO;
import com.booking.booking_ticket.dto.response.*;
import com.booking.booking_ticket.entity.BookingCombo;
import com.booking.booking_ticket.entity.Voucher;
import com.booking.booking_ticket.repository.BookingComboRepository;
import com.booking.booking_ticket.repository.BookingRepository;
import com.booking.booking_ticket.repository.ShowTimeRepository;
import com.booking.booking_ticket.repository.VoucherUsageRepository;
import com.booking.booking_ticket.service.BookingService;
import com.booking.booking_ticket.utils.PaymentStatus;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class BookingServiceImpl implements BookingService {

    private final BookingRepository bookingRepository;

    private final VoucherUsageRepository voucherUsageRepository;

    private final BookingComboRepository bookingComboRepository;

    private final ShowTimeRepository showTimeRepository;

    @Override
    public List<BookingDTO> getUserBooking(Integer userId){
        List<BookingDTO> bookings = bookingRepository.findBookingByUserId(userId);
        return bookings;
    }

    @Override
    public List<BookingSimpleDTO> getByShowTimeId (Integer showTimeId){
        List<BookingSimpleDTO> bookingSimpleDTOs = bookingRepository.findBookingSimpleDTOByShowTimeId(showTimeId);
        return bookingSimpleDTOs;
    }

    @Override
    public List<BookingResponse> getAllBookingResponses() {
        return bookingRepository.getAllBookingResponse();
    }

    @Override
    public Page<OrderResponse> getList(Pageable pageable, String keyword, PaymentStatus paymentStatus, LocalDate startDate, LocalDate endDate) {
        if (keyword != null){
            keyword = "%" + keyword.trim().toLowerCase() + "%";
        } else {
            keyword = "%";
        }

        return bookingRepository.findAllByKeyword(pageable, keyword, paymentStatus, startDate, endDate);
    }

    @Override
    public OrderResponse getById(Integer id) {
        List<Voucher> vouchers = voucherUsageRepository.findByBookingId(id);
        List<BookingComboResponse> bookingCombos = bookingComboRepository.findAllByBookingId(id);
        ShowTimeResponse showTime = showTimeRepository.findByBookingId(id);

        OrderResponse response = bookingRepository.findOrderByBookingId(id);
        response.setShowTime(showTime);
        response.setVouchers(vouchers);
        response.setBookingCombos(bookingCombos);

        return response;
    }

    @Override
    public Page<OrderResponse> getListByTheaterId(Integer id, Pageable pageable, String keyword, PaymentStatus paymentStatus, LocalDate startDate, LocalDate endDate) {
        if (keyword != null){
            keyword = "%" + keyword.trim().toLowerCase() + "%";
        } else {
            keyword = "%";
        }

        return bookingRepository.
        findAllByKeywordAndTheaterId(id, pageable, keyword, paymentStatus, startDate, endDate);
    }
}
