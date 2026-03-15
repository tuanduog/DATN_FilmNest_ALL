package com.booking.booking_ticket.dto;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CommentDTO {
    private Integer commentId;
    private Integer parentId; // cho nested reply
    private String content;
    private Integer level;
    private LocalDateTime createdAt;
    private Integer movieId;
    private Integer userId;
    private String userName; // tiện gửi ra client
}
