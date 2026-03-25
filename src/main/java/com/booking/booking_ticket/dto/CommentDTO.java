package com.booking.booking_ticket.dto;

import java.time.LocalDateTime;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CommentDTO {

    Integer commentId;

    Integer parentId; // cho nested reply

    String content;

    Integer level;

    LocalDateTime createdAt;

    Integer movieId;

    Integer userId;

    String userName; // tiện gửi ra client
}
