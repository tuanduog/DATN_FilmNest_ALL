package com.booking.booking_ticket.dto.response;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

@Data
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ReactionResponse {

    Integer commentId;

    Integer likeCount;

    Integer dislikeCount;

    String myReaction;

    @JsonIgnore
    Integer movieId;
}
