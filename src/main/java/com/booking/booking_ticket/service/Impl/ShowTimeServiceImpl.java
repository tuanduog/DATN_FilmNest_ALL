package com.booking.booking_ticket.service.Impl;

import com.booking.booking_ticket.dto.RoomDTO;
import com.booking.booking_ticket.dto.ShowTimeDTO;
import com.booking.booking_ticket.dto.TheaterDTO;
import com.booking.booking_ticket.dto.request.ShowTimeRequest;
import com.booking.booking_ticket.dto.response.ShowTimeResponse;
import com.booking.booking_ticket.entity.Room;
import com.booking.booking_ticket.entity.ShowTime;
import com.booking.booking_ticket.entity.Theater;
import com.booking.booking_ticket.repository.MovieRepository;
import com.booking.booking_ticket.repository.RoomRepository;
import com.booking.booking_ticket.repository.ShowTimeRepository;
import com.booking.booking_ticket.service.ShowTimeService;
import com.booking.booking_ticket.utils.ShowingStatus;
import com.booking.booking_ticket.utils.Status;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ShowTimeServiceImpl implements ShowTimeService {

    private final ShowTimeRepository showTimeRepository;

    private final MovieRepository movieRepository;

    private final RoomRepository roomRepository;

    @Override
    public List<ShowTimeDTO> getByMovieId(int movieId) {
        List<ShowTime> entities = showTimeRepository.findByMovie_Id(movieId);

        return entities.stream().map(show -> {
            Room room = show.getRoom();
            Theater theater = room.getTheater();

            TheaterDTO theaterDTO = new TheaterDTO(
                    theater.getId(),
                    theater.getName(),
                    theater.getAddress());

            RoomDTO roomDTO = new RoomDTO(
                    room.getId(),
                    room.getName(),
                    room.getCapacity(),
                    room.getType(),
                    theaterDTO);

            return new ShowTimeDTO(
                    show.getId(),
                    show.getStartTime(),
                    roomDTO);
        }).toList();
    }

    @Override
    public List<ShowTimeResponse> getShowTime() {
        return showTimeRepository.findAllShowtimes();
    }

    @Override
    public Page<ShowTimeResponse> getList(Pageable pageable, String keyword, Status status){
        if (keyword != null){
            keyword = "%" + keyword.trim().toLowerCase() + "%";
        } else {
            keyword = "%";
        }

        return showTimeRepository.findAllByKeyword(pageable, keyword, status);
    }

    @Override
    public void addShowTime(ShowTimeRequest request){

    }

    @Override
    public void updateShowTime(Integer id, ShowTimeRequest request){

    }

    @Override
    public ShowTimeResponse getById(Integer id){
        return null;
    }

    @Override
    public void deleteShowTime(Integer id) {

    }

    @Override
    public List<ShowTimeResponse> getShowtimeByRoomId(int id){
        String showingStatus = ShowingStatus.NOW_SHOWING.getValue();
        return showTimeRepository.findShow_timeByRooms(id, showingStatus);
    }
}
