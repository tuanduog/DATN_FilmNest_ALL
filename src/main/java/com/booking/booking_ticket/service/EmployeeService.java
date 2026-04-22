package com.booking.booking_ticket.service;

import com.booking.booking_ticket.dto.request.EmployeeRequest;
import com.booking.booking_ticket.dto.response.EmployeeResponse;
import com.booking.booking_ticket.utils.Role;
import com.booking.booking_ticket.utils.Status;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface EmployeeService {

    public Page<EmployeeResponse> getList(Pageable pageable, String keyword, Status status, Role role);

    public void addEmployee(EmployeeRequest request);

    public EmployeeResponse getById(Integer id);

    public void updateEmployee(Integer id, EmployeeRequest request);

    public void deleteEmployee(Integer id);
}
