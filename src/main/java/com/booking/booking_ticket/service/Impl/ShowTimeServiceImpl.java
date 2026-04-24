package com.booking.booking_ticket.service.Impl;

import com.booking.booking_ticket.dto.RoomDTO;
import com.booking.booking_ticket.dto.ShowTimeDTO;
import com.booking.booking_ticket.dto.TheaterDTO;
import com.booking.booking_ticket.dto.request.ShowTimeRequest;
import com.booking.booking_ticket.dto.response.ShowTimeResponse;
import com.booking.booking_ticket.entity.Movie;
import com.booking.booking_ticket.entity.Room;
import com.booking.booking_ticket.entity.ShowTime;
import com.booking.booking_ticket.entity.Theater;
import com.booking.booking_ticket.repository.MovieRepository;
import com.booking.booking_ticket.repository.RoomRepository;
import com.booking.booking_ticket.repository.ShowTimeRepository;
import com.booking.booking_ticket.service.ShowTimeService;
import com.booking.booking_ticket.utils.ShowingStatus;
import com.booking.booking_ticket.utils.Status;
import com.booking.booking_ticket.utils.Util;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ShowTimeServiceImpl implements ShowTimeService {

    private final ShowTimeRepository showTimeRepository;

    private final MovieRepository movieRepository;

    private final RoomRepository roomRepository;

    private final Util util;

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
        util.validateShowTime(request, null);
        ShowTime showTime = new ShowTime();
        showTime.setStartTime(request.getStartTime());
        showTime.setShowDate(request.getShowDate());
        showTime.setSurcharge(request.getSurcharge());
        Movie movie = movieRepository.findById(request.getMovieId()).orElseThrow(() -> new RuntimeException("Movie does not exists"));
        showTime.setMovie(movie);
        Room room = roomRepository.findById(request.getRoomId()).orElseThrow(() -> new RuntimeException("Room does not exists"));
        showTime.setRoom(room);
        showTime.setStatus(Status.ACTIVE);

        showTimeRepository.save(showTime);
    }

    @Override
    public void updateShowTime(Integer id, ShowTimeRequest request){
        ShowTime showTime = showTimeRepository.findById(id).orElseThrow(() -> new RuntimeException("Show time does not exists"));
        util.validateShowTime(request, id);
        if (request.getShowDate() != null){
            showTime.setShowDate(request.getShowDate());
        }
        if (request.getSurcharge() != null){
            showTime.setSurcharge(request.getSurcharge());
        }
        if (request.getStartTime() != null){
            showTime.setStartTime(request.getStartTime());
        }
        if (request.getRoomId() != null){
            Room room = roomRepository.findById(request.getRoomId()).orElseThrow(() -> new RuntimeException("Room does not exists"));
            showTime.setRoom(room);
        }
        if (request.getMovieId() != null){
            Movie movie = movieRepository.findById(request.getMovieId()).orElseThrow(() -> new RuntimeException("Movie does not exists"));
            showTime.setMovie(movie);
        }

        showTimeRepository.save(showTime);
    }

    @Override
    public ShowTimeResponse getById(Integer id){
        ShowTime showTime = showTimeRepository.findById(id).orElseThrow(() -> new RuntimeException("Show time does not exists"));
        ShowTimeResponse response = new ShowTimeResponse();
        response.setId(showTime.getId());
        response.setShowDate(showTime.getShowDate());
        response.setStartTime(showTime.getStartTime());
        response.setSurcharge(showTime.getSurcharge());
        response.setStatus(showTime.getStatus());

        Movie movie = movieRepository.findById(showTime.getMovie().getId()).orElseThrow(() -> new RuntimeException("Movie does not exists"));
        response.setMovieName(movie.getName());
        response.setMovieId(movie.getId());

        Room room = roomRepository.findById(showTime.getRoom().getId()).orElseThrow(() -> new RuntimeException("Room does not exists"));
        Theater theater = room.getTheater();
        response.setTheaterName(theater.getName());
        response.setRoomName(room.getName());
        response.setRoomId(room.getId());
        response.setTheaterId(theater.getId());

        return response;
    }

    @Override
    public void deleteShowTime(Integer id) {
        ShowTime showTime = showTimeRepository.findById(id).orElseThrow(() -> new RuntimeException("Show time does not exists"));
        showTime.setStatus(Status.INACTIVE);

        showTimeRepository.save(showTime);
    }

    @Override
    public List<ShowTimeResponse> getShowtimeByRoomId(int id){
        String showingStatus = ShowingStatus.NOW_SHOWING.getValue();
        return showTimeRepository.findShow_timeByRooms(id, showingStatus);
    }
}
