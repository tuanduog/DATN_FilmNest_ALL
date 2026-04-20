package com.booking.booking_ticket.repository;

import com.booking.booking_ticket.dto.response.UserResponse;
import com.booking.booking_ticket.entity.Users;
import com.booking.booking_ticket.utils.Status;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UsersRepository extends JpaRepository<Users, Integer> {
    
    Optional<Users> findByUsername(String username);
    Optional<Users> findByEmail(String email);
    Optional<Users> findByPhone(String phone);

    @Query("""
        SELECT new com.booking.booking_ticket.dto.response.UserResponse(u.id, u.username, u.email, u.phone, u.gender, u.dob, u.nationality, u.role, u.status)
        FROM Users u
        WHERE (LOWER(u.username) LIKE :keyword OR LOWER(u.email) LIKE :keyword)
        AND (:status IS NULL OR u.status = :status)
    """)
    Page<UserResponse> findAllByKeyword(Pageable pageable, String keyword, Status status);
}
