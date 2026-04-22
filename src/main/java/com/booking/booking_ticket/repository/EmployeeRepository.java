package com.booking.booking_ticket.repository;

import com.booking.booking_ticket.dto.response.EmployeeResponse;
import com.booking.booking_ticket.entity.Employee;
import com.booking.booking_ticket.utils.Role;
import com.booking.booking_ticket.utils.Status;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Optional;

public interface EmployeeRepository extends JpaRepository<Employee, Integer> {

    @Query("""
        SELECT new com.booking.booking_ticket.dto.response.EmployeeResponse(e.id, e.code, e.salary, e.hireAt, u.email, u.fullname, u.phone, u.gender, u.role, t.name, e.status)
        FROM Employee e
            JOIN Users u ON u.id = e.user.id
            LEFT JOIN Theater t ON t.id = e.theater.id
        WHERE (LOWER(e.code) LIKE :keyword OR LOWER(u.email) LIKE :keyword)
        AND (:status IS NULL OR e.status = :status)
        AND u.role <> "ADMINISTRATOR" AND u.role <> "USER"
        AND (:role IS NULL OR u.role = :role)
    """)
    Page<EmployeeResponse> findAllByKeyword(Pageable pageable, String keyword, Status status, Role role);

    Optional<Employee> findByUser_Id(Integer id);

    @Query("""
        SELECT e
        FROM Employee e
        WHERE (:id IS NULL OR e.id <> :id)
            AND (:code IS NULL OR e.code = :code)
    """)
    Optional<Employee> validateCode(String code, Integer id);

}
