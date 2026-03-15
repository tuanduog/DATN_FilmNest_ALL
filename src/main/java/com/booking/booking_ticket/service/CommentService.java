package com.booking.booking_ticket.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.booking.booking_ticket.dto.CommentDTO;
import com.booking.booking_ticket.entity.Comments;
import com.booking.booking_ticket.entity.Movies;
import com.booking.booking_ticket.entity.Users;
import com.booking.booking_ticket.repository.CommentRepository;
import com.booking.booking_ticket.repository.MovieRepository;
import com.booking.booking_ticket.repository.UsersRepository;

@Service
public class CommentService {
        @Autowired
        private CommentRepository commentRepository;

        @Autowired
        private MovieRepository movieRepository;

        @Autowired
        private UsersRepository usersRepository;

        public Comments saveCmt(CommentDTO cmt) {
                Movies movie = movieRepository.findById(cmt.getMovieId())
                                .orElseThrow(() -> new RuntimeException("Movie not found"));

                Users user = usersRepository.findByUserId(cmt.getUserId())
                                .orElseThrow(() -> new RuntimeException("User not found"));

                Comments comments = Comments.builder()
                                .parentId(cmt.getParentId() != 0 || cmt.getParentId() != null ? cmt.getParentId()
                                                : null)
                                .content(cmt.getContent())
                                .level(cmt.getLevel())
                                .createdAt(LocalDateTime.now())
                                .movie(movie)
                                .user(user)
                                .build();

                return commentRepository.save(comments);
        }

        public List<CommentDTO> getAllComment(Integer movieId) {
                List<Comments> comments = commentRepository.findByMovie_MovieIdOrderByCreatedAtAsc(movieId);
                return comments.stream() // stream thay the cho for
                                .map(c -> new CommentDTO(
                                                c.getCommentId(),
                                                c.getParentId(),
                                                c.getContent(),
                                                c.getLevel(),
                                                c.getCreatedAt(),
                                                c.getMovie().getMovieId(),
                                                c.getUser().getUserId(),
                                                c.getUser().getUsername()))
                                .toList();
        }
}
