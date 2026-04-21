package com.booking.booking_ticket.service.Impl;

import com.booking.booking_ticket.dto.request.EmployeeRequest;
import com.booking.booking_ticket.dto.response.EmployeeResponse;
import com.booking.booking_ticket.entity.Employee;
import com.booking.booking_ticket.entity.Theater;
import com.booking.booking_ticket.entity.Users;
import com.booking.booking_ticket.repository.EmployeeRepository;
import com.booking.booking_ticket.repository.TheaterRepository;
import com.booking.booking_ticket.repository.UsersRepository;
import com.booking.booking_ticket.service.EmployeeService;
import com.booking.booking_ticket.utils.Status;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class EmployeeServiceImpl implements EmployeeService {

    private final EmployeeRepository employeeRepository;

    private final TheaterRepository theaterRepository;

    private final UsersRepository usersRepository;

    @Override
    public Page<EmployeeResponse> getList(Pageable pageable, String keyword, Status status) {
        if (keyword != null) {
            keyword = "%"  + keyword + "%";
        } else {
            keyword = "%";
        }

        return employeeRepository.findAllByKeyword(pageable, keyword, status);
    }

    @Override
    public void addEmployee(EmployeeRequest request) {
        Employee employee = new Employee();

        employee.setCode(request.getCode());
        employee.setSalary(request.getSalary());
        employee.setHireAt(request.getHireAt());

        Theater theater = theaterRepository.findById(request.getTheaterId()).orElseThrow(() -> new RuntimeException("Theater not found"));
        employee.setTheater(theater);

        Users user = usersRepository.findById(request.getUserId()).orElseThrow(() -> new RuntimeException("User not found"));
        employee.setUser(user);
        employeeRepository.save(employee);
    }

    @Override
    public EmployeeResponse getById(Integer id) {
        return null;
    }

    @Override
    public void updateEmployee(Integer id, EmployeeRequest request) {

    }

    @Override
    public void deleteEmployee(Integer id) {
        Employee employee = employeeRepository.findById(id).orElseThrow(() -> new RuntimeException("Employee not found"));
        employee.setStatus(Status.INACTIVE);
        employeeRepository.save(employee);
    }
}
