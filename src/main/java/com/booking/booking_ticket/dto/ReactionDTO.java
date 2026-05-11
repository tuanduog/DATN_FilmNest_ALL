package com.booking.booking_ticket.dto;

import com.booking.booking_ticket.utils.ReactionType;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ReactionDTO {

    Integer commentId;

    Integer userId;

    ReactionType type;
}
