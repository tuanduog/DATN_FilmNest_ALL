package com.booking.booking_ticket.repository;

import com.booking.booking_ticket.dto.response.UserResponse;
import com.booking.booking_ticket.entity.Users;
import com.booking.booking_ticket.utils.Role;
import com.booking.booking_ticket.utils.Status;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UsersRepository extends JpaRepository<Users, Integer> {

    @Query("""
        SELECT u
        FROM Users u
        WHERE u.username = :username
            AND (:id IS NULL OR u.id <> :id)
    """)
    Optional<Users> validateUsername(String username, Integer id);

    Optional<Users> findByUsername(String username);

    @Query("""
        SELECT u
        FROM Users u
        WHERE u.email = :email
            AND (:id IS NULL OR u.id <> :id)
    """)
    Optional<Users> findByEmail(String email, Integer id);

    @Query("""
        SELECT u
        FROM Users u
        WHERE u.phone = :phone
            AND (:id IS NULL OR u.id <> :id)
    """)
    Optional<Users> findByPhone(String phone, Integer id);

    @Query("""
        SELECT new com.booking.booking_ticket.dto.response.UserResponse(u.id, u.username, u.email, u.fullname, u.phone, u.gender, u.dob, u.nationality, u.role, u.status)
        FROM Users u
        WHERE (LOWER(u.username) LIKE :keyword OR LOWER(u.email) LIKE :keyword)
        AND (:status IS NULL OR u.status = :status)
        AND u.role = :role
    """)
    Page<UserResponse> findAllByKeyword(Pageable pageable, String keyword, Status status, Role role);
}
