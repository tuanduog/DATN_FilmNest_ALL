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
import com.booking.booking_ticket.utils.Util;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class EmployeeServiceImpl implements EmployeeService {

    private final EmployeeRepository employeeRepository;

    private final TheaterRepository theaterRepository;

    private final UsersRepository usersRepository;

    private final Util util;

    private final PasswordEncoder passwordEncoder;

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
    @Transactional
    public void addEmployee(EmployeeRequest request) {
        util.validateEmployeeCode(request.getCode(), null);
        if(request.getUserId() != null){
            Optional<Users> user = usersRepository.findById(request.getUserId());
            if(user.isPresent()){
                if(request.getUsername() != null){
                    user.get().setUsername(request.getUsername());
                }

                if(request.getEmail() != null){
                    user.get().setEmail(request.getEmail());
                }

                if(request.getFullname() != null){
                    user.get().setFullname(request.getFullname());
                }

                if(request.getPhone() != null){
                    user.get().setPhone(request.getPhone());
                }

                if(request.getDob() != null){
                    user.get().setDob(request.getDob());
                }

                if(request.getGender() != null){
                    user.get().setGender(request.getGender());
                }

                if(request.getNationality() != null){
                    user.get().setNationality(request.getNationality());
                }

                if(request.getRole() != null){
                    user.get().setRole(request.getRole());
                }
                usersRepository.save(user.get());

                Employee employee = new Employee();
                employee.setUser(user.get());
                employee.setCode(request.getCode());
                employee.setSalary(request.getSalary());
                employee.setHireAt(request.getHireAt());

                if(request.getTheaterId() != null){
                    Optional<Theater> theater = theaterRepository.findById(request.getTheaterId());
                    if(theater.isPresent()){
                        employee.setTheater(theater.get());
                    }
                }
                if(request.getManagerId() != null){
                    Optional<Employee> manager = employeeRepository.findById(request.getManagerId());
                    if(manager.isPresent()){
                        employee.setManager(manager.get());
                    }
                }
                employeeRepository.save(employee);
            }
        } else {
            Users user = new Users();
            user.setUsername(request.getUsername());
            user.setEmail(request.getEmail());
            user.setFullname(request.getFullname());
            user.setPassword(passwordEncoder.encode("123456"));
            user.setPhone(request.getPhone());
            user.setDob(request.getDob());
            user.setGender(request.getGender());
            user.setNationality(request.getNationality());
            user.setRole(request.getRole());
            user.setStatus(Status.ACTIVE);
            usersRepository.save(user);

            Employee employee = new Employee();
            employee.setUser(user);
            employee.setCode(request.getCode());
            employee.setSalary(request.getSalary());
            employee.setHireAt(request.getHireAt());
            employee.setStatus(Status.ACTIVE);

            if(request.getTheaterId() != null){
                Optional<Theater> theater = theaterRepository.findById(request.getTheaterId());
                if(theater.isPresent()){
                    employee.setTheater(theater.get());
                }
            }
            if(request.getManagerId() != null){
                Optional<Employee> manager = employeeRepository.findById(request.getManagerId());
                if(manager.isPresent()){
                    employee.setManager(manager.get());
                }
            }
            employeeRepository.save(employee);
        }
    }

    @Override
    public EmployeeResponse getById(Integer id) {
        Optional<Employee> employee = employeeRepository.findById(id);
        if(employee.isPresent()){
            EmployeeResponse response = new EmployeeResponse();
            response.setId(employee.get().getId());
            response.setCode(employee.get().getCode());
            response.setSalary(employee.get().getSalary());
            response.setHireAt(employee.get().getHireAt());
            response.setStatus(employee.get().getStatus());

            Users user = employee.get().getUser();
            response.setEmail(user.getEmail());
            response.setUsername(user.getUsername());
            response.setFullname(user.getFullname());
            response.setPhone(user.getPhone());
            response.setDob(user.getDob());
            response.setGender(user.getGender());
            response.setNationality(user.getNationality());
            response.setRole(user.getRole());

            Employee manager = employee.get().getManager();
            if(manager != null){
                response.setManagerName(manager.getUser().getFullname());
                response.setManagerId(manager.getUser().getId());
            }

            response.setTheaterName(employee.get().getTheater().getName());
            response.setTheaterId(employee.get().getTheater().getId());

            return response;
        }
        return null;
    }

    @Override
    public void updateEmployee(Integer id, EmployeeRequest request) {
        Optional<Employee> employee = employeeRepository.findById(id);

        Optional<Users> user = usersRepository.findById(request.getUserId());
        if(user.isPresent()){
            util.validateUser(request.getUsername(), request.getEmail(), request.getPhone(), user.get().getId());
            user.get().setUsername(request.getUsername());
            user.get().setEmail(request.getEmail());
            user.get().setPhone(request.getPhone());
            user.get().setDob(request.getDob());
            user.get().setGender(request.getGender());
            user.get().setNationality(request.getNationality());
            user.get().setRole(request.getRole());
            usersRepository.save(user.get());
        }
        if(employee.isPresent()){
            util.validateEmployeeCode(request.getCode(), employee.get().getId());
            if(request.getCode() != null){
                employee.get().setCode(request.getCode());
            }
            if(request.getSalary() != null){
                employee.get().setSalary(request.getSalary());
            }
            if(request.getHireAt() != null){
                employee.get().setHireAt(request.getHireAt());
            }
            if(request.getTheaterId() != null){
                Optional<Theater> theater = theaterRepository.findById(request.getTheaterId());
                if(theater.isPresent()){
                    employee.get().setTheater(theater.get());
                }
            }
            if(request.getManagerId() != null){
                Optional<Employee> manager = employeeRepository.findById(request.getManagerId());
                if(manager.isPresent()){
                    employee.get().setManager(manager.get());
                }
            }
            employeeRepository.save(employee.get());
        }
    }

    @Override
    public void deleteEmployee(Integer id) {
        Employee employee = employeeRepository.findById(id).orElseThrow(() -> new RuntimeException("Employee not found"));
        employee.setStatus(Status.INACTIVE);
        employeeRepository.save(employee);
    }
}
