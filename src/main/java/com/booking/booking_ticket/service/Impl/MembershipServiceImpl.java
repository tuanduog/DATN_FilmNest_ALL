package com.booking.booking_ticket.service.Impl;

import com.booking.booking_ticket.dto.request.MembershipBenefitRequest;
import com.booking.booking_ticket.dto.request.MembershipRequest;
import com.booking.booking_ticket.dto.response.MembershipBenefitResponse;
import com.booking.booking_ticket.dto.response.MembershipResponse;
import com.booking.booking_ticket.entity.*;
import com.booking.booking_ticket.repository.*;
import com.booking.booking_ticket.service.MembershipService;
import com.booking.booking_ticket.utils.BenefitType;
import com.booking.booking_ticket.utils.MembershipPaymentStatus;
import com.booking.booking_ticket.utils.Status;
import com.booking.booking_ticket.utils.Util;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

@Service
public class MembershipServiceImpl implements MembershipService {

    @Autowired
    private MembershipRepository membershipRepository;

    @Autowired
    private MembershipBenefitRepository membershipBenefitRepository;

    @Autowired
    private ComboRepository comboRepository;

    @Autowired
    private VoucherRepository voucherRepository;

    @Autowired
    private Util util;

    @Autowired
    private UsersMembershipRepository usersMembershipRepository;

    @Autowired
    private UsersRepository usersRepository;

    @Override
    public Page<MembershipResponse> getList(Pageable pageable, String keyword, Status status){
        if (keyword != null){
            keyword = "%" + keyword.trim().toLowerCase() + "%";
        } else {
            keyword = "%";
        }

        return membershipRepository.getList(pageable, keyword, status);
    }

    @Override
    @Transactional
    public void addMembership(MembershipRequest request){
        Optional<Membership> checkValid = membershipRepository.findByName(request.getName());
        if (checkValid.isPresent()){
            throw new IllegalArgumentException("Gói thành viên này đã tồn tại rồi");
        }
        Membership membership = new Membership();

        membership.setImage(request.getImage());
        membership.setName(request.getName());
        membership.setType(request.getType());
        membership.setPrice(request.getPrice());
        membership.setDuration(request.getDuration());
        membership.setStatus(Status.ACTIVE);
        Membership savedMembership = membershipRepository.save(membership);

        List<MembershipBenefitRequest> benefitRequest = Arrays.stream(request.getBenefits()).toList();
        List<MembershipBenefit> listBenefit = new ArrayList<>();
        for (MembershipBenefitRequest r : benefitRequest){
            MembershipBenefit benefit = new MembershipBenefit();
            benefit.setType(r.getType());
            benefit.setDescription(r.getDescription());
            benefit.setQuantity(r.getQuantity());
            benefit.setBenefitRefId(r.getBenefitRefId());
            benefit.setStatus(Status.ACTIVE);
            benefit.setMembership(savedMembership);
            listBenefit.add(benefit);
        }

        membershipBenefitRepository.saveAll(listBenefit);
    }

    @Override
    public void updateMembership(Integer id, MembershipRequest request){
        Membership membership = membershipRepository.findById(id).orElseThrow(() -> new RuntimeException("Membership does not exist"));

        if (request.getImage() != null){
            membership.setImage(request.getImage());
        }

        if (request.getName() != null){
            membership.setName(request.getName());
        }

        if (request.getType() != null){
            membership.setType(request.getType());
        }

        if (request.getPrice() != null){
            membership.setPrice(request.getPrice());
        }

        if (request.getDuration() != null){
            membership.setDuration(request.getDuration());
        }
        membershipRepository.save(membership);

        List<MembershipBenefitRequest> benefitRequest = Arrays.stream(request.getBenefits()).toList();
        List<MembershipBenefit> listBenefit = new ArrayList<>();
        for (MembershipBenefitRequest r : benefitRequest){
            Optional<MembershipBenefit> benefit = membershipBenefitRepository.findById(r.getId());
            if (benefit.isPresent()){
                benefit.get().setType(r.getType());
                benefit.get().setDescription(r.getDescription());
                benefit.get().setQuantity(r.getQuantity());
                benefit.get().setBenefitRefId(r.getBenefitRefId());
                listBenefit.add(benefit.get());
            }
        }
        membershipBenefitRepository.saveAll(listBenefit);
    }

    @Override
    public MembershipResponse getById(Integer id){
        Membership membership = membershipRepository.findById(id).orElseThrow(() -> new RuntimeException("Membership does not exist"));

        MembershipResponse response = new MembershipResponse();
        response.setId(membership.getId());
        response.setImage(membership.getImage());
        response.setName(membership.getName());
        response.setType(membership.getType());
        response.setPrice(membership.getPrice());
        response.setDuration(membership.getDuration());
        response.setStatus(membership.getStatus());

        List<MembershipBenefit> benefits = membershipBenefitRepository.findByMembership_Id(id);
        List<MembershipBenefitResponse> benefitResponse = new ArrayList<>();
        for (MembershipBenefit benefit : benefits){
            MembershipBenefitResponse responseBenefit = new MembershipBenefitResponse();
            responseBenefit.setId(benefit.getId());
            responseBenefit.setQuantity(benefit.getQuantity());
            responseBenefit.setType(benefit.getType());
            if (benefit.getType().equals(BenefitType.COMBO)){
                Optional<Combo> combo = comboRepository.findById(benefit.getBenefitRefId());
                if (combo.isPresent()){
                    responseBenefit.setCombo(combo.get());
                }
            }
            if (benefit.getType().equals(BenefitType.VOUCHER)){
                Optional<Voucher> voucher = voucherRepository.findById(benefit.getBenefitRefId());
                if (voucher.isPresent()){
                    responseBenefit.setVoucher(voucher.get());
                }
            }
            if (benefit.getType().equals(BenefitType.DIRECT)){
                responseBenefit.setDescription(benefit.getDescription());
            }
            benefitResponse.add(responseBenefit);
        }
        response.setBenefits(benefitResponse.toArray(new MembershipBenefitResponse[0]));

        return response;
    }

    @Override
    public void deleteMembership(Integer id){
        Optional<Membership> membership = membershipRepository.findById(id);
        if (membership.isPresent()){
            membership.get().setStatus(Status.INACTIVE);
            membershipRepository.save(membership.get());
        }
    }

    @Override
    public List<MembershipResponse> getAll() {
        List<Membership> memberships = membershipRepository.findAllMembership(Status.ACTIVE);

        List<MembershipResponse> response = new ArrayList<>();
        for (Membership m : memberships){
            MembershipResponse r = getById(m.getId());
            response.add(r);
        }

        return response;
    }

    @Override
    public MembershipResponse getByUserId() {
        Integer userId = util.getLoginUserId();

        MembershipResponse response = new MembershipResponse();
        Optional<UsersMembership> usersMembership = usersMembershipRepository.findByUserId(userId, MembershipPaymentStatus.ACTIVE);
        if (usersMembership.isPresent()){
            Membership m = usersMembership.get().getMembership();
            response.setId(m.getId());
            response.setType(m.getType());
            response.setPrice(m.getPrice());
            response.setName(m.getName());
            response.setDuration(m.getDuration());
            response.setPaymentStatus(usersMembership.get().getMembershipPaymentStatus());
            response.setStatus(m.getStatus());
            response.setStartDate(usersMembership.get().getStartDate());
            response.setEndDate(usersMembership.get().getExpiredDate());

            return response;
        }
        return null;
    }

    @Override
    public void addPayment(Integer userId, Integer membershipId) {
        Membership membership = membershipRepository.findById(membershipId).orElseThrow(() -> new RuntimeException("Membership does not exist"));
        Users user = usersRepository.findById(userId).orElseThrow(() -> new RuntimeException("User does not exist"));

        UsersMembership usersMembership = new UsersMembership();
        usersMembership.setMembership(membership);
        usersMembership.setUser(user);
        usersMembership.setPrice(membership.getPrice());
        usersMembership.setStartDate(LocalDateTime.now());
        LocalDateTime endTime = LocalDateTime.now().plusDays(membership.getDuration());
        usersMembership.setExpiredDate(endTime);
        usersMembership.setMembershipPaymentStatus(MembershipPaymentStatus.ACTIVE);
        usersMembership.setStatus(Status.ACTIVE);

        usersMembershipRepository.save(usersMembership);
    }
}
