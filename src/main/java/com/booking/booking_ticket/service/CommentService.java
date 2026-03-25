package com.booking.booking_ticket.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.booking.booking_ticket.dto.CommentDTO;
import com.booking.booking_ticket.entity.Comment;
import com.booking.booking_ticket.entity.Movie;
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

        public Comment saveCmt(CommentDTO cmt) {
                Movie movie = movieRepository.findAllById(cmt.getMovieId());

                Users user = usersRepository.findById(cmt.getUserId())
                                .orElseThrow(() -> new RuntimeException("User not found"));

                Comment comments = Comment.builder()
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
                List<Comment> comments = commentRepository.findByMovie_IdOrderByCreatedAtAsc(movieId);
                return comments.stream() // stream thay the cho for
                                .map(c -> new CommentDTO(
                                                c.getId(),
                                                c.getParentId(),
                                                c.getContent(),
                                                c.getLevel(),
                                                c.getCreatedAt(),
                                                c.getMovie().getId(),
                                                c.getUser().getId(),
                                                c.getUser().getUsername()))
                                .toList();
        }
}
