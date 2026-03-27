package com.booking.booking_ticket.service;

import com.booking.booking_ticket.dto.ShowTimeDTO;
import com.booking.booking_ticket.dto.request.ShowTimeRequestDTO;
import com.booking.booking_ticket.dto.response.ShowtimeResponse;

import java.util.List;

public interface ShowTimeService {

    public List<ShowTimeDTO> getByMovieId(int movieId);

    public List<ShowtimeResponse> getShowTime();

    public int addShowtime(ShowTimeRequestDTO showTimeRequestDTO);

    public int editShowtime(int id, ShowTimeRequestDTO showTimeRequestDTO);

    public int deleteMovie(int id);

    public List<ShowtimeResponse> getShowtimeByRoomId(int id);
}
