package com.booking.booking_ticket.repository;

import com.booking.booking_ticket.entity.Voucher;
import com.booking.booking_ticket.entity.VoucherUsage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface VoucherUsageRepository extends JpaRepository<VoucherUsage, Integer> {

    @Query("""
        SELECT COUNT(vu.id)
        FROM VoucherUsage vu
        WHERE vu.voucher.id = :voucherId
    """)
    Integer countVoucherUsage(Integer voucherId);

    @Query("""
        SELECT vu.voucher
        FROM VoucherUsage vu
        WHERE vu.user.id = :userId
            AND vu.voucher.id = :voucherId
    """)
    List<Voucher> checkVoucherUsage(Integer userId, Integer voucherId);
}
