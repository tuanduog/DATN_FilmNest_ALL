package com.booking.booking_ticket.dto;

import java.time.Instant;

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

    Instant createdAt;

    Integer movieId;

    Integer userId;

    String userName; // tiện gửi ra client

    Integer likeCount;

    Integer dislikeCount;

    String myReaction;

    public CommentDTO(Integer commentId, Integer parentId, String content, Integer level, Instant createdAt, Integer movieId, Integer userId, String userName){
        this.commentId = commentId;
        this.parentId = parentId;
        this.content = content;
        this.level = level;
        this.createdAt = createdAt;
        this.movieId = movieId;
        this.userId = userId;
        this.userName = userName;
    }
}
