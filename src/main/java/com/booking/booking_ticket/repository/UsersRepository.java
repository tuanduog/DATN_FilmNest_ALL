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

    @Query("""
        SELECT e
        FROM Employee e
        WHERE (:id IS NULL OR e.id <> :id)
            AND (:username IS NULL OR e.user.username = :username)
    """)
    Optional<Users> validateUsername(String username, Integer id);

    Optional<Users> findByUsername(String username);

    @Query("""
        SELECT e
        FROM Employee e
        WHERE (:id IS NULL OR e.id <> :id)
            AND (:username IS NULL OR e.user.email = :email)
    """)
    Optional<Users> findByEmail(String email, Integer id);

    @Query("""
        SELECT e
        FROM Employee e
        WHERE (:id IS NULL OR e.id <> :id)
            AND (:username IS NULL OR e.user.phone = :phone)
    """)
    Optional<Users> findByPhone(String phone, Integer id);

    @Query("""
        SELECT new com.booking.booking_ticket.dto.response.UserResponse(u.id, u.username, u.email, u.fullname, u.phone, u.gender, u.dob, u.nationality, u.role, u.status)
        FROM Users u
        WHERE (LOWER(u.username) LIKE :keyword OR LOWER(u.email) LIKE :keyword)
        AND (:status IS NULL OR u.status = :status)
        AND u.role <> "ADMINISTRATOR"
    """)
    Page<UserResponse> findAllByKeyword(Pageable pageable, String keyword, Status status);
}
