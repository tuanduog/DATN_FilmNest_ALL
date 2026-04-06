package com.booking.booking_ticket.service.Impl;

import com.booking.booking_ticket.dto.request.ComboRequest;
import com.booking.booking_ticket.dto.response.ComboResponse;
import com.booking.booking_ticket.entity.Combo;
import com.booking.booking_ticket.repository.ComboRepository;
import com.booking.booking_ticket.service.ComboService;
import com.booking.booking_ticket.utils.Status;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ComboServiceImpl implements ComboService {

    private final ComboRepository comboRepository;

    @Override
    public Page<ComboResponse> getList(Pageable pageable, String keyword, Status status){
        if (keyword != null){
            keyword = "%" + keyword.trim().toLowerCase() + "%";
        } else {
            keyword = "%";
        }

        return comboRepository.getList(pageable, keyword, status);
    }

    @Override
    public void addCombo(ComboRequest request){
        Optional<Combo> checkValid = comboRepository.findByName(request.getName());
        if (checkValid.isPresent()){
            throw new IllegalArgumentException("Combo ưu đãi này đã tồn tại rồi");
        }
        Combo combo = new Combo();

        combo.setImage(request.getImage());
        combo.setName(request.getName());
        combo.setPrice(request.getPrice());
        combo.setDescription(request.getDescription());
        combo.setStatus(Status.ACTIVE);

        comboRepository.save(combo);
    }

    @Override
    public ComboResponse getById(Integer id){
        Combo combo = comboRepository.getById(id);

        ComboResponse response = new ComboResponse();
        if (combo != null){
           response.setId(combo.getId());
           response.setName(combo.getName());
           response.setPrice(combo.getPrice());
           response.setDescription(combo.getDescription());
           response.setStatus(combo.getStatus());
        } else return null;

        return response;
    }

    @Override
    public void updateCombo(Integer id, ComboRequest request){
        Combo combo = comboRepository.getOne(id);

        if (request.getName() != null){
            combo.setName(request.getName());
        }

        if (request.getPrice() != null){
            combo.setPrice(request.getPrice());
        }

        if (request.getDescription() != null){
            combo.setDescription(request.getDescription());
        }

        comboRepository.save(combo);
    }

    @Override
    public void deleteCombo(Integer id){
        Combo combo = comboRepository.getOne(id);

        if(combo.getStatus().equals(Status.ACTIVE)){
            combo.setStatus(Status.INACTIVE);
        }

        comboRepository.save(combo);
    }
}
