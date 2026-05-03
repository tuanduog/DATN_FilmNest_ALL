package com.booking.booking_ticket.repository;

import com.booking.booking_ticket.entity.BookingCombo;
import com.booking.booking_ticket.utils.BookingComboType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface BookingComboRepository extends JpaRepository<BookingCombo,Integer> {

    @Query("""
        SELECT CASE WHEN COUNT(bc) > 0 THEN true ELSE false END
        FROM BookingCombo bc
        WHERE bc.combo.id = :comboId
            AND bc.booking.user.id = :userId
            AND bc.type = :type
    """)
    boolean checkComboFreeUsage(Integer comboId, Integer userId, BookingComboType type);
}
