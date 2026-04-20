package com.booking.booking_ticket.repository;

import com.booking.booking_ticket.dto.response.EmployeeResponse;
import com.booking.booking_ticket.entity.Employee;
import com.booking.booking_ticket.utils.Status;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface EmployeeRepository extends JpaRepository<Employee, Integer> {

    @Query("""
        SELECT new com.booking.booking_ticket.dto.response.EmployeeResponse(e.id, e.code, e.salary, e.hireAt, u.email, u.fullname, u.phone, u.role, e.status)
        FROM Employee e
        JOIN Users u ON u.id = e.user.id
        WHERE (LOWER(e.code) LIKE :keyword OR LOWER(u.email) LIKE :keyword)
        AND :status IS NULL OR e.status = :status
        AND u.role <> "ADMINISTRATOR" AND u.role <> "USER"
    """)
    Page<EmployeeResponse> findAllByKeyword(Pageable pageable, String keyword, Status status);
}
