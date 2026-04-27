package com.booking.booking_ticket.repository;

import com.booking.booking_ticket.dto.response.VoucherResponse;
import com.booking.booking_ticket.entity.Voucher;
import com.booking.booking_ticket.utils.Status;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Optional;

public interface VoucherRepository extends JpaRepository<Voucher, Integer> {

    @Query("""
        SELECT new com.booking.booking_ticket.dto.response.VoucherResponse(v.id, v.code, v.type, v.discount, v.startDate, v.endDate, v.quantity, v.status)
        FROM Voucher v
        WHERE (LOWER(v.code) LIKE :keyword)
            AND (:status IS NULL OR v.status = :status)
    """)
    Page<VoucherResponse> findAllByKeyword(Pageable pageable, String keyword, Status status);

    @Query("""
        SELECT v
        FROM Voucher v
        WHERE v.code = :code
            AND (:id IS NULL OR v.id <> :id)
    """)
    Optional<Voucher> validateVoucher(String code, Integer id);
}
