package com.booking.booking_ticket.service.Impl;

import com.booking.booking_ticket.dto.CommentDTO;
import com.booking.booking_ticket.entity.Comment;
import com.booking.booking_ticket.entity.Movie;
import com.booking.booking_ticket.entity.Reaction;
import com.booking.booking_ticket.entity.Users;
import com.booking.booking_ticket.repository.CommentRepository;
import com.booking.booking_ticket.repository.MovieRepository;
import com.booking.booking_ticket.repository.ReactionRepository;
import com.booking.booking_ticket.repository.UsersRepository;
import com.booking.booking_ticket.service.CommentService;
import com.booking.booking_ticket.utils.ReactionType;
import com.booking.booking_ticket.utils.Status;
import com.booking.booking_ticket.utils.Util;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;

@Service
public class CommentServiceImpl implements CommentService {

    @Autowired
    private CommentRepository commentRepository;

    @Autowired
    private MovieRepository movieRepository;

    @Autowired
    private UsersRepository usersRepository;

    @Autowired
    private ReactionRepository reactionRepository;

    @Autowired
    private Util util;

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
        comment.setStatus(Status.ACTIVE);

        return commentRepository.save(comment);
    }

    @Override
    public List<CommentDTO> getAllComment(Integer movieId) {
        Integer userId = util.getLoginUserId();
        List<Comment> comments = commentRepository.findByMovie_IdOrderByCreatedAtAsc(movieId);
        return comments.stream().map(c -> {
            Integer likeCount = reactionRepository.countByCommentIdAndType(c.getId(), ReactionType.LIKE, Status.ACTIVE);
            Integer dislikeCount = reactionRepository.countByCommentIdAndType(c.getId(), ReactionType.DISLIKE, Status.ACTIVE);

            Reaction r = reactionRepository.findByUser_IdAndComment_Id(userId, c.getId()).orElse(null);

            String myReaction = (r == null) ? null : r.getType().getValue();

            return new CommentDTO(
                    c.getId(),
                    c.getParentId(),
                    c.getContent(),
                    c.getLevel(),
                    c.getCreatedAt(),
                    c.getMovie().getId(),
                    c.getUser().getId(),
                    c.getUser().getUsername(),
                    likeCount,
                    dislikeCount,
                    myReaction);
        }).toList();
    }
}
