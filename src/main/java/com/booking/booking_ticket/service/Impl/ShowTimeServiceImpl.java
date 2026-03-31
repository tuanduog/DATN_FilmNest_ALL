package com.booking.booking_ticket.service.Impl;

import com.booking.booking_ticket.dto.RoomDTO;
import com.booking.booking_ticket.dto.ShowTimeDTO;
import com.booking.booking_ticket.dto.TheaterDTO;
import com.booking.booking_ticket.dto.request.ShowTimeRequest;
import com.booking.booking_ticket.dto.response.ShowtimeResponse;
import com.booking.booking_ticket.entity.Room;
import com.booking.booking_ticket.entity.ShowTime;
import com.booking.booking_ticket.entity.Theater;
import com.booking.booking_ticket.repository.MovieRepository;
import com.booking.booking_ticket.repository.RoomRepository;
import com.booking.booking_ticket.repository.ShowTimeRepository;
import com.booking.booking_ticket.service.ShowTimeService;
import com.booking.booking_ticket.utils.ShowingStatus;
import lombok.RequiredArgsConstructor;
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
    public List<ShowtimeResponse> getShowTime() {
        return showTimeRepository.findAllShowtimes();
    }

    @Override
    public int addShowtime(ShowTimeRequest showTimeRequest) {
        ShowTime showTime = new ShowTime();
        showTime.setStartTime(showTimeRequest.getStartTime());
        showTime.setMovie(movieRepository.findById(showTimeRequest.getMovieId()).get());
        showTime.setRoom(roomRepository.findById(showTimeRequest.getRoomId()).get());

        showTimeRepository.save(showTime);

        return showTime.getId();
    }

    @Override
    public int editShowtime(int id, ShowTimeRequest showTimeRequest) {
        ShowTime show_time = showTimeRepository.findById(id).get();
        show_time.setStartTime(showTimeRequest.getStartTime());
        show_time.setRoom(roomRepository.findById(showTimeRequest.getRoomId()).get());
        show_time.setMovie(movieRepository.findById(showTimeRequest.getMovieId()).get());
        showTimeRepository.save(show_time);
        return show_time.getId();
    }

    @Override
    public int deleteMovie(int id) {
        showTimeRepository.deleteById(id);
        return id;
    }

    @Override
    public List<ShowtimeResponse> getShowtimeByRoomId(int id){
        String showingStatus = ShowingStatus.NOW_SHOWING.getValue();
        return showTimeRepository.findShow_timeByRooms(id, showingStatus);
    }
}
