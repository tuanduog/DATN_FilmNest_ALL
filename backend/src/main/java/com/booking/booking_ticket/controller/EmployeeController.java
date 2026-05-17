package com.booking.booking_ticket.controller;

import com.booking.booking_ticket.dto.request.EmployeeRequest;
import com.booking.booking_ticket.dto.response.EmployeeResponse;
import com.booking.booking_ticket.dto.response.ResponseData;
import com.booking.booking_ticket.service.EmployeeService;
import com.booking.booking_ticket.utils.Role;
import com.booking.booking_ticket.utils.Status;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

@Controller
@RestController
@RequiredArgsConstructor
@Slf4j
@RequestMapping("/api/employee")
public class EmployeeController {

    private final EmployeeService employeeService;

    @GetMapping("/v1")
    public ResponseData<?> getList(@PageableDefault() Pageable pageable,
                                   @RequestParam(required = false) String keyword,
                                   @RequestParam(required = false) Status status,
                                   @RequestParam(required = false) Role role){
        Page<EmployeeResponse> data = employeeService.getList(pageable, keyword, status, role);
        return new ResponseData<>(HttpStatus.OK.value(), "Get List Successful", data);
    }

    @PostMapping("/v1")
    public ResponseData<?> addEmployee(@RequestBody EmployeeRequest request){
        employeeService.addEmployee(request);
        return new ResponseData<>(HttpStatus.OK.value(), "Add Employee Successful");
    }

    @GetMapping("/v1/{id}")
    public ResponseData<?> getById(@PathVariable Integer id){
        return new ResponseData<>(HttpStatus.OK.value(), "Get Employee Successful", employeeService.getById(id));
    }

    @PutMapping("/v1/{id}")
    public ResponseData<?> updateEmployee(@PathVariable Integer id, @RequestBody EmployeeRequest request){
        employeeService.updateEmployee(id, request);
        return new ResponseData<>(HttpStatus.OK.value(), "Update Employee Successful");
    }

    @DeleteMapping("/v1/{id}")
    public ResponseData<?> deleteEmployee(@PathVariable Integer id){
        employeeService.deleteEmployee(id);
        return new ResponseData<>(HttpStatus.OK.value(), "Delete Employee Successful");
    }
}
