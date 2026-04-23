package com.booking.booking_ticket.service;

import com.booking.booking_ticket.dto.ShowTimeDTO;
import com.booking.booking_ticket.dto.request.ShowTimeRequest;
import com.booking.booking_ticket.dto.response.ShowTimeResponse;
import com.booking.booking_ticket.utils.Status;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface ShowTimeService {

    public List<ShowTimeDTO> getByMovieId(int movieId);

    public List<ShowTimeResponse> getShowTime();

    public Page<ShowTimeResponse> getList(Pageable pageable, String keyword, Status status);

    public void addShowTime(ShowTimeRequest request);

    public void updateShowTime(Integer id, ShowTimeRequest request);

    public ShowTimeResponse getById(Integer id);

    public void deleteShowTime(Integer id);

    public List<ShowTimeResponse> getShowtimeByRoomId(int id);
}
