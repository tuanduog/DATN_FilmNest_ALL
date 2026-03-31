package com.booking.booking_ticket.service.Impl;

import com.booking.booking_ticket.dto.CommentDTO;
import com.booking.booking_ticket.entity.Comment;
import com.booking.booking_ticket.entity.Movie;
import com.booking.booking_ticket.entity.Users;
import com.booking.booking_ticket.repository.CommentRepository;
import com.booking.booking_ticket.repository.MovieRepository;
import com.booking.booking_ticket.repository.UsersRepository;
import com.booking.booking_ticket.service.CommentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class CommentServiceImpl implements CommentService {

    @Autowired
    private CommentRepository commentRepository;

    @Autowired
    private MovieRepository movieRepository;

    @Autowired
    private UsersRepository usersRepository;

    @Override
    public Comment saveCmt(CommentDTO cmt) {
        Movie movie = movieRepository.findAllById(cmt.getMovieId());

        Users user = usersRepository.findById(cmt.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Comment comment = new Comment();
        comment.setParentId(cmt.getParentId() != 0 || cmt.getParentId() != null ? cmt.getParentId()
                : null);
        comment.setContent(cmt.getContent());
        comment.setLevel(cmt.getLevel());
        comment.setCreatedAt(Instant.now());
        comment.setMovie(movie);
        comment.setUser(user);

        return commentRepository.save(comment);
    }

    @Override
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
