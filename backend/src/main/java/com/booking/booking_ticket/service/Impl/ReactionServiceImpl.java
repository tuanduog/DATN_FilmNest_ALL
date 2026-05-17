package com.booking.booking_ticket.service.Impl;

import com.booking.booking_ticket.dto.ReactionDTO;
import com.booking.booking_ticket.dto.response.ReactionResponse;
import com.booking.booking_ticket.entity.Comment;
import com.booking.booking_ticket.entity.Reaction;
import com.booking.booking_ticket.entity.Users;
import com.booking.booking_ticket.repository.CommentRepository;
import com.booking.booking_ticket.repository.ReactionRepository;
import com.booking.booking_ticket.repository.UsersRepository;
import com.booking.booking_ticket.service.ReactionService;
import com.booking.booking_ticket.utils.ReactionType;
import com.booking.booking_ticket.utils.Status;
import com.booking.booking_ticket.utils.Util;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ReactionServiceImpl implements ReactionService {

    @Autowired
    private ReactionRepository reactionRepository;

    @Autowired
    private Util util;

    @Autowired
    private CommentRepository commentRepository;

    @Autowired
    private UsersRepository usersRepository;

    @Override
    @Transactional
    public ReactionResponse processReaction(ReactionDTO dto) {
        if (dto.getCommentId() == null) {
            throw new IllegalArgumentException("commentId must not be null – check WebSocket payload deserialization");
        }

        boolean isUndo = dto.getType() == ReactionType.UNLIKE || dto.getType() == ReactionType.UNDISLIKE;

        Comment comment = commentRepository.findById(dto.getCommentId())
                .orElseThrow(() -> new IllegalArgumentException("Comment not found with ID: " + dto.getCommentId()));
        Integer movieId = comment.getMovie().getId();

        Reaction reaction = reactionRepository.findByUser_IdAndComment_Id(dto.getUserId(), dto.getCommentId()).orElse(null);

        if (reaction == null) {
            if (!isUndo) {
                // Tạo reaction mới
                Users user = usersRepository.findById(dto.getUserId()).orElseThrow();
                reaction = new Reaction();
                reaction.setComment(comment);
                reaction.setUser(user);
                reaction.setType(dto.getType());
                reaction.setStatus(Status.ACTIVE);
                reactionRepository.save(reaction);
            }
            // Nếu isUndo mà chưa có reaction → không làm gì
        } else {
            if (isUndo) {
                // Hủy reaction: đánh dấu INACTIVE
                reaction.setType(dto.getType());
                reaction.setStatus(Status.INACTIVE);
            } else {
                // LIKE hoặc DISLIKE (mới hoặc switch)
                reaction.setType(dto.getType());
                reaction.setStatus(Status.ACTIVE);
            }
            reactionRepository.save(reaction);
        }

        // Tính lại count sau khi lưu
        Integer likeCount    = reactionRepository.countByCommentIdAndType(dto.getCommentId(), ReactionType.LIKE,    Status.ACTIVE);
        Integer dislikeCount = reactionRepository.countByCommentIdAndType(dto.getCommentId(), ReactionType.DISLIKE, Status.ACTIVE);

        // Lấy trạng thái reaction hiện tại của user
        Reaction current = reactionRepository.findByUser_IdAndComment_Id(dto.getUserId(), dto.getCommentId()).orElse(null);
        String myReaction = (current == null || current.getStatus() == Status.INACTIVE)
                ? null
                : current.getType().getValue();

        return new ReactionResponse(dto.getCommentId(), likeCount, dislikeCount, myReaction, movieId);
    }
}
