package com.booking.booking_ticket.service.Impl;

import com.booking.booking_ticket.dto.request.TheaterRequest;
import com.booking.booking_ticket.dto.response.TheaterResponse;
import com.booking.booking_ticket.entity.Theater;
import com.booking.booking_ticket.repository.TheaterRepository;
import com.booking.booking_ticket.service.TheaterService;
import com.booking.booking_ticket.utils.Status;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TheaterServiceImpl implements TheaterService {

    @Autowired
    public TheaterRepository theaterRepository;

    @Override
    public List<String> getLocations() {
        return theaterRepository.getLocations();
    }

    @Override
    public List<Theater> getTheatersByLocation(String location) {
        return theaterRepository.getTheatersByTheaterLocation(location);
    }

    @Override
    public List<Theater> getAllTheater() {
        return theaterRepository.findAll();
    }

    @Override
    public Page<TheaterResponse> getList(Pageable pageable, String keyword, Status status){
        if (keyword != null){
            keyword = "%" + keyword.trim().toLowerCase() + "%";
        } else {
            keyword = "%";
        }

        return theaterRepository.findAllForKeyword(pageable, keyword, status);
    }

    @Override
    public TheaterResponse getById(Integer id){
        Theater theater = theaterRepository.getOne(id);

        TheaterResponse response = new TheaterResponse();
        response.setId(theater.getId());
        response.setAddress(theater.getAddress());
        response.setName(theater.getName());
        response.setHotline(theater.getHotline());
        response.setOpenTime(theater.getOpenTime());
        response.setCloseTime(theater.getCloseTime());
        response.setStatus(theater.getStatus());
        response.setCommuneName(theater.getCommuneName());
        response.setProvinceName(theater.getProvinceName());
        response.setDescription(theater.getDescription());
        response.setLatitude(theater.getLatitude());
        response.setLongitude(theater.getLongitude());
        response.setProvinceCode(theater.getProvinceCode());
        response.setCommuneCode(theater.getCommuneCode());

        return response;
    }

    @Override
    public void addTheater(TheaterRequest request) {
        Theater theater = new Theater();

        theater.setName(request.getName());
        theater.setAddress(request.getAddress());
        theater.setProvinceCode(request.getProvinceCode());
        theater.setProvinceName(request.getProvinceName());
        theater.setCommuneCode(request.getCommuneCode());
        theater.setCommuneName(request.getCommuneName());

        theater.setLatitude(request.getLatitude());
        theater.setLongitude(request.getLongitude());
        theater.setPlaceId(request.getPlaceId());

        theater.setDescription(request.getDescription());
        theater.setHotline(request.getHotline());

        theater.setOpenTime(request.getOpenTime());
        theater.setCloseTime(request.getCloseTime());
        theater.setStatus(Status.ACTIVE);

        theaterRepository.save(theater);
    }

    @Override
    public void editTheater(int id, TheaterRequest request) {
        Theater theater = theaterRepository.getOne(id);

        if (theater.getName() != null) {
            theater.setName(request.getName());
        }
        if (request.getAddress() != null) {
            theater.setAddress(request.getAddress());
        }
        if (request.getProvinceCode() != null) {
            theater.setProvinceCode(request.getProvinceCode());
        }
        if (request.getProvinceName() != null) {
            theater.setProvinceName(request.getProvinceName());
        }
        if (request.getCommuneCode() != null) {
            theater.setCommuneCode(request.getCommuneCode());
        }
        if (request.getCommuneName() != null) {
            theater.setCommuneName(request.getCommuneName());
        }
        if (request.getLatitude() != null) {
            theater.setLatitude(request.getLatitude());
        }
        if (request.getLongitude() != null) {
            theater.setLongitude(request.getLongitude());
        }
        if (request.getPlaceId() != null) {
            theater.setPlaceId(request.getPlaceId());
        }
        if (request.getDescription() != null) {
            theater.setDescription(request.getDescription());
        }
        if (request.getHotline() != null) {
            theater.setHotline(request.getHotline());
        }
        if (request.getOpenTime() != null) {
            theater.setOpenTime(request.getOpenTime());
        }
        if (request.getCloseTime() != null) {
            theater.setCloseTime(request.getCloseTime());
        }

        theaterRepository.save(theater);
    }

    @Override
    public void deleteTheater(int id) {
        Theater theater = theaterRepository.findById(id).get();
        theater.setStatus(Status.INACTIVE);

        theaterRepository.save(theater);
    }
}