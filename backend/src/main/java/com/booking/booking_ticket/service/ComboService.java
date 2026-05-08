package com.booking.booking_ticket.service;

import com.booking.booking_ticket.dto.request.ComboRequest;
import com.booking.booking_ticket.dto.response.ComboResponse;
import com.booking.booking_ticket.utils.Status;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface ComboService {

    public Page<ComboResponse> getList(Pageable pageable, String keyword, Status status);

    public void addCombo(ComboRequest request);

    public ComboResponse getById(Integer id);

    public void updateCombo(Integer id, ComboRequest request);

    public void deleteCombo(Integer id);
}
