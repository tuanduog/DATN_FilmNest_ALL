package com.booking.booking_ticket.service;

import java.util.List;

import com.booking.booking_ticket.dto.request.ShowTimeRequestDTO;
import com.booking.booking_ticket.dto.response.ShowtimeResponse;
import com.booking.booking_ticket.repository.MoviesRepository;
import com.booking.booking_ticket.repository.RoomRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import com.booking.booking_ticket.dto.RoomDTO;
import com.booking.booking_ticket.dto.ShowTimeDTO;
import com.booking.booking_ticket.dto.TheaterDTO;
import com.booking.booking_ticket.entity.Rooms;
import com.booking.booking_ticket.entity.Show_time;
import com.booking.booking_ticket.entity.Theaters;
import com.booking.booking_ticket.repository.ShowTimeRepository;

@Service
@RequiredArgsConstructor
public class ShowTimeService {

    private final ShowTimeRepository showTimeRepository;

    private final MoviesRepository moviesRepository;

    private final RoomRepository roomRepository;

    public List<ShowTimeDTO> getByMovieId(int movieId) {
        List<Show_time> entities = showTimeRepository.findByMovie_Id(movieId);

        return entities.stream().map(show -> {
            Rooms room = show.getRoom();
            Theaters theater = room.getTheater(); // ⚠ Nếu lazy, cần gọi đủ để nó load

            TheaterDTO theaterDTO = new TheaterDTO(
                    theater.getId(),
                    theater.getTheaterName(),
                    theater.getTheaterLocation());

            RoomDTO roomDTO = new RoomDTO(
                    room.getId(),
                    room.getRoomName(),
                    theaterDTO);

            return new ShowTimeDTO(
                    show.getId(),
                    show.getStartTime(),
                    roomDTO);
        }).toList();
    }

    public List<ShowtimeResponse> getShowTime() {

        return showTimeRepository.findAllShowtimes();
    }

    public int addShowtime(ShowTimeRequestDTO showTimeRequestDTO) {
        Show_time show_time = Show_time.builder()
                .startTime(showTimeRequestDTO.getStartTime())
                .movie(moviesRepository.findById(showTimeRequestDTO.getMovieId()).get())
                .room(roomRepository.findById(showTimeRequestDTO.getRoomId()).get())
                .build();

        showTimeRepository.save(show_time);

        return show_time.getId();
    }

    public int editShowtime(int id, ShowTimeRequestDTO showTimeRequestDTO) {
        Show_time show_time = showTimeRepository.findById(id).get();
        show_time.setStartTime(showTimeRequestDTO.getStartTime());
        show_time.setRoom(roomRepository.findById(showTimeRequestDTO.getRoomId()).get());
        show_time.setMovie(moviesRepository.findById(showTimeRequestDTO.getMovieId()).get());
        showTimeRepository.save(show_time);
        return show_time.getId();
    }

    public int deleteMovie(int id) {
        showTimeRepository.deleteById(id);
        return id;
    }
    public List<ShowtimeResponse> getShowtimeByRoomId(int id){
        return showTimeRepository.findShow_timeByRooms(id);
    }

}
