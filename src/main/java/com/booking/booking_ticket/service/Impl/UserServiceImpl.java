package com.booking.booking_ticket.service.Impl;

import com.booking.booking_ticket.dto.request.ChangePasswordRequest;
import com.booking.booking_ticket.dto.request.UserRequest;
import com.booking.booking_ticket.dto.request.UserUpdateRequest;
import com.booking.booking_ticket.dto.response.*;
import com.booking.booking_ticket.entity.*;
import com.booking.booking_ticket.repository.*;
import com.booking.booking_ticket.service.UserService;
import com.booking.booking_ticket.utils.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCrypt;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class UserServiceImpl implements UserService {

    @Autowired
    private UsersRepository usersRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private EmployeeRepository employeeRepository;

    @Autowired
    private Util util;

    @Autowired
    private VoucherRepository voucherRepository;

    @Autowired
    private VoucherUsageRepository voucherUsageRepository;

    @Autowired
    private UsersMembershipRepository usersMembershipRepository;

    @Autowired
    private BookingComboRepository bookingComboRepository;

    @Autowired
    private ComboRepository comboRepository;

    @Override
    public UserResponse getUserProfile(){
        Users user = util.getLoginUser();
        UserResponse response = new UserResponse();
        response.setId(user.getId());
        response.setUsername(user.getUsername());
        response.setEmail(user.getEmail());
        response.setGender(user.getGender());
        response.setDob(user.getDob());
        response.setStatus(user.getStatus());
        response.setRole(user.getRole());
        response.setPhone(user.getPhone());
        response.setNationality(user.getNationality());
        response.setFullname(user.getFullname());

        return response;
    }

    @Override
    public void updateUserProfile(UserUpdateRequest request){
        Users user = util.getLoginUser();
        util.validateUser(request.getUsername(), request.getEmail(), request.getPhone(), user.getId());
        if (request.getUsername() != null){
            user.setUsername(request.getUsername());
        }

        if (request.getEmail() != null){
            user.setEmail(request.getEmail());
        }

        if (request.getPhone() != null){
            user.setPhone(request.getPhone());
        }

        if (request.getFullname() != null){
            user.setFullname(request.getFullname());
        }

        if (request.getDob() != null){
            user.setDob(request.getDob());
        }

        if (request.getGender() != null){
            user.setGender(request.getGender());
        }

        if (request.getNationality() != null){
            user.setNationality(request.getNationality());
        }

        usersRepository.save(user);
    }

    @Override
    public void changePassword(ChangePasswordRequest request){
        Users user = util.getLoginUser();

        if (!BCrypt.checkpw(request.getOldPassword(), user.getPassword())){
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Old password not match");
        } else {
            user.setPassword(passwordEncoder.encode(request.getNewPassword()));
            usersRepository.save(user);
        }
    }

    @Override
    public Page<UserResponse> getList(Pageable pageable, String keyword, Status status){
        if (keyword != null){
            keyword = "%" + keyword.trim().toLowerCase() + "%";
        } else {
            keyword = "%";
        }

        return usersRepository.findAllByKeyword(pageable, keyword, status, Role.USER);
    }

    @Override
    public UserResponse getById(Integer id){
        Users user = usersRepository.findById(id).orElseThrow(() -> new UsernameNotFoundException("Username not exists!"));
        UserResponse response = new UserResponse();
        response.setId(user.getId());
        response.setUsername(user.getUsername());
        response.setEmail(user.getEmail());
        response.setPhone(user.getPhone());
        response.setDob(user.getDob());
        response.setGender(user.getGender());
        response.setNationality(user.getNationality());
        response.setRole(user.getRole());
        return response;
    }

    @Override
    public void addUser(UserRequest request){
        util.validateUser(request.getUsername(), request.getEmail(), request.getPhone(), null);
        Users user = new Users();
        user.setUsername(request.getUsername());
        user.setFullname(request.getFullname());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode("123456"));
        user.setPhone(request.getPhone());
        user.setDob(request.getDob());
        user.setGender(request.getGender());
        user.setNationality(request.getNationality());
        user.setStatus(Status.ACTIVE);
        usersRepository.save(user);
    }

    @Override
    public void updateUser(Integer id, UserRequest request){
        Users user = usersRepository.findById(id).orElseThrow(() -> new UsernameNotFoundException("Username not exists!"));
        util.validateExistUsername(user.getUsername(), request.getUsername(), id);
        util.validateExistEmail(user.getEmail(), request.getEmail(), id);
        util.validateExistPhone(user.getPhone(), request.getPhone(), id);

        user.setUsername(request.getUsername());
        user.setFullname(request.getFullname());
        user.setEmail(request.getEmail());
        user.setPhone(request.getPhone());
        user.setDob(request.getDob());
        user.setGender(request.getGender());
        user.setNationality(request.getNationality());

        if (request.getStatus() != null){
            if (user.getStatus().equals(Status.ACTIVE)){
                user.setStatus(Status.INACTIVE);
            } else {
                user.setStatus(Status.ACTIVE);
            }
        }
        usersRepository.save(user);
    }

    @Override
    public void deleteUser(Integer id){
        Users user = usersRepository.findById(id).orElseThrow(() -> new UsernameNotFoundException("Username not exists"));
        user.setStatus(Status.INACTIVE);
        usersRepository.save(user);
    }

    @Override
    public ResponseData<?> checkExistUser(String username){
        Optional<Users> user = usersRepository.findByUsername(username);

        if(user.isPresent()){
            Optional<Employee> employee = employeeRepository.findByUser_Id(user.get().getId());
            if(employee.isPresent()){
                return new ResponseData<>(1, "Đã tồn tại nhân viên với số tài khoản này rồi");
            }
            if(user.get().getRole().equals(Role.USER) || user.get().getRole().equals(Role.ADMINISTRATOR)){
                return new ResponseData<>(2, "Đã tồn tại người dùng với số tài khoản này rồi");
            } else {
                UserResponse response = new UserResponse();
                response.setId(user.get().getId());
                response.setUsername(user.get().getUsername());
                response.setFullname(user.get().getFullname());
                response.setEmail(user.get().getEmail());
                response.setPhone(user.get().getPhone());
                response.setDob(user.get().getDob());
                response.setGender(user.get().getGender());
                response.setNationality(user.get().getNationality());
                response.setRole(user.get().getRole());
                return new ResponseData<>(3, "Thông tin người dùng", response);
            }
        }
        return new ResponseData<>(4, "Chưa có người dùng");
    }

    @Override
    public UserBenefitResponse getBenefitsForUser() {
        UserBenefitResponse response = new UserBenefitResponse();
        Integer userId = util.getLoginUserId();

        // những public voucher chưa dùng và còn dùng được
        List<VoucherUsageResponse> voucherResponse = new ArrayList<>();
        List<Voucher> vouchers = voucherRepository.getPublicVoucher(VoucherType.PUBLIC, Status.ACTIVE);
        for (Voucher voucher : vouchers){
            List<Voucher> v = voucherUsageRepository.checkVoucherUsage(userId, voucher.getId());
            if (v == null || v.isEmpty()) { // chưa dùng thì check xem còn để dùng ko
                boolean isValidDate;

                if (voucher.getStartDate() != null && voucher.getEndDate() != null) {
                    isValidDate = voucher.getStartDate().isBefore(LocalDate.now()) && voucher.getEndDate().isAfter(LocalDate.now());
                } else {
                    isValidDate = true;
                }

                boolean checkMaxUsed = checkMaxUsedVoucher(voucher.getId(), voucher.getQuantity());

                if (isValidDate && !checkMaxUsed) {
                    VoucherUsageResponse voucherUsageResponse = new VoucherUsageResponse();
                    voucherUsageResponse.setId(voucher.getId());
                    voucherUsageResponse.setStartDate(voucher.getStartDate());
                    voucherUsageResponse.setEndDate(voucher.getEndDate());
                    voucherUsageResponse.setCode(voucher.getCode());
                    voucherUsageResponse.setDescription(voucher.getDescription());
                    voucherUsageResponse.setDiscount(voucher.getDiscount());
                    voucherUsageResponse.setType(voucher.getType());
                    voucherUsageResponse.setMinOrderValue(voucher.getMinOrderValue());

                    voucherResponse.add(voucherUsageResponse);
                }
            }
        }

        // voucher trong gói + combo free trong gói
        List<ComboUsageResponse> comboResponse = new ArrayList<>();
        LocalDateTime now = LocalDateTime.now();
        List<MembershipBenefit> benefits = usersMembershipRepository.findUserBenefit(userId, now, BenefitType.DIRECT);
        for (MembershipBenefit benefit : benefits){
            if (benefit.getType().equals(BenefitType.COMBO)){
                boolean checkComboUsage = bookingComboRepository.checkComboFreeUsage(benefit.getBenefitRefId(), userId, BookingComboType.FREE);
                if (!checkComboUsage) {
                    ComboUsageResponse cur = new ComboUsageResponse();
                    Combo combo = comboRepository.findById(benefit.getBenefitRefId()).orElse(null);
                    if (combo != null) {
                        cur.setId(combo.getId());
                        cur.setImage(combo.getImage());
                        cur.setPrice(combo.getPrice());
                        cur.setName(combo.getName());
                        cur.setDescription(combo.getDescription());
                        cur.setStatus(combo.getStatus());
                        cur.setQuantity(benefit.getQuantity());
                        comboResponse.add(cur);
                    }
                }
            } else if (benefit.getType().equals(BenefitType.VOUCHER)){
                List<Voucher> used = voucherUsageRepository.checkVoucherUsage(userId, benefit.getBenefitRefId());

                if (used.size() < benefit.getQuantity()) {
                    Voucher v = voucherRepository.findById(benefit.getBenefitRefId()).orElse(null);
                    if (v != null) {
                        boolean isValidDate;

                        if (v.getStartDate() != null && v.getEndDate() != null) {
                            isValidDate = v.getStartDate().isBefore(LocalDate.now()) &&
                                    v.getEndDate().isAfter(LocalDate.now());
                        } else {
                            isValidDate = true;
                        }

                        if (isValidDate) {
                            VoucherUsageResponse voucherUsageResponse = new VoucherUsageResponse();
                            voucherUsageResponse.setId(v.getId());
                            voucherUsageResponse.setStartDate(v.getStartDate());
                            voucherUsageResponse.setEndDate(v.getEndDate());
                            voucherUsageResponse.setCode(v.getCode());
                            voucherUsageResponse.setDescription(v.getDescription());
                            voucherUsageResponse.setDiscount(v.getDiscount());
                            voucherUsageResponse.setType(v.getType());
                            voucherUsageResponse.setQuantity(benefit.getQuantity());

                            voucherResponse.add(voucherUsageResponse);
                        }
                    }
                }
            }
        }

        response.setVouchers(voucherResponse);
        response.setCombos(comboResponse);
        return response;
    }

    public boolean checkMaxUsedVoucher(Integer voucherId, Integer quantity) {
        Integer countVoucherUsage = voucherUsageRepository.countVoucherUsage(voucherId);
        if (countVoucherUsage < quantity) {
            return false;
        } else  {
            return true;
        }
    }
}
