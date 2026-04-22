package com.booking.booking_ticket.entity;

import com.booking.booking_ticket.utils.SeatStatus;
import com.booking.booking_ticket.utils.SeatType;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "seat")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Seat extends BaseEntity {

    String code;

    Double price;

    @Column(name = "row_index")
    Integer rowIndex;

    @Column(name = "column_index")
    Integer columnIndex;

    @Enumerated(EnumType.STRING)
    SeatType type;

    @Column(name = "seat_status")
    @Enumerated(EnumType.STRING)
    SeatStatus seatStatus;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "room_id")
    private Room room;
}
