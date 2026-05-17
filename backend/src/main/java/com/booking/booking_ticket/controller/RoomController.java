package com.booking.booking_ticket.controller;

import com.booking.booking_ticket.dto.request.RoomRequest;
import com.booking.booking_ticket.dto.response.ResponseData;
import com.booking.booking_ticket.dto.response.ResponseError;
import com.booking.booking_ticket.entity.Room;
import com.booking.booking_ticket.service.Impl.RoomServiceImpl;
import com.booking.booking_ticket.service.RoomService;
import com.booking.booking_ticket.utils.RoomType;
import com.booking.booking_ticket.utils.Status;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Controller
@RestController
@RequiredArgsConstructor
@Slf4j
@RequestMapping("/api/room")
public class RoomController {

    private final RoomServiceImpl roomServiceImpl;

    private final RoomService roomService;

    @GetMapping("/getRoomsByTheaterId")
    public ResponseData<?> getRoomByTheaterId(@RequestParam int theaterId)
    {
        try{
            List<Room> result = roomServiceImpl.getRoomByTheaterId(theaterId);
            System.out.println(result.size());
            if(!result.isEmpty())
                return new ResponseData<>(HttpStatus.OK.value(),"Có phonòng",result);
            else
                return new ResponseError(HttpStatus.BAD_REQUEST.value(), "room null");
        }
        catch (Exception e)
        {
            log.error("there is an error of introspect: {}",e.getMessage());
            return new ResponseError(HttpStatus.BAD_REQUEST.value(), e.getMessage());
        }
    }

    @GetMapping("/v1")
    public ResponseData<?> getList(@PageableDefault() Pageable pageable,
                                   @RequestParam(required = false) String keyword,
                                   @RequestParam(required = false) Status status,
                                   @RequestParam(required = false) RoomType type) {
        return new ResponseData<>(HttpStatus.OK.value(), "Get list successful", roomService.getList(pageable, keyword, status, type));
    }

    @GetMapping("/v1/{id}")
    public ResponseData<?> getById(@PathVariable Integer id){
        return new ResponseData<>(HttpStatus.OK.value(), "Get room successful", roomService.getById(id));
    }

    @PostMapping("/v1")
    public ResponseData<?> addRoom(@RequestBody RoomRequest request){
        roomService.addRoom(request);
        return new ResponseData<>(HttpStatus.OK.value(), "Add room successful");
    }

    @PutMapping("/v1/{id}")
    public ResponseData<?> updateRoom(@PathVariable Integer id, @RequestBody RoomRequest request){
        roomService.updateRoom(id, request);
        return new ResponseData<>(HttpStatus.OK.value(), "Update room successful");
    }

    @DeleteMapping("/v1/{id}")
    public ResponseData<?> deleteRoom(@PathVariable Integer id){
        roomService.deleteRoom(id);
        return new ResponseData<>(HttpStatus.OK.value(), "Delete room successful");
    }

    @GetMapping("/v1/theater/{id}")
    public ResponseData<?> getListByTheaterId(@PathVariable Integer id,
                                              @PageableDefault() Pageable pageable,
                                              @RequestParam(required = false) String keyword,
                                              @RequestParam(required = false) Status status,
                                              @RequestParam(required = false) RoomType type){
        return new ResponseData<>(HttpStatus.OK.value(), "Get list successful", roomService.getListByTheaterId(id, pageable, keyword, status, type));
    }
}
