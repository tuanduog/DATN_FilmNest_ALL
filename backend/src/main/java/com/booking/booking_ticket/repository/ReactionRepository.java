package com.booking.booking_ticket.repository;

import com.booking.booking_ticket.entity.Reaction;
import com.booking.booking_ticket.utils.ReactionType;
import com.booking.booking_ticket.utils.Status;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ReactionRepository extends JpaRepository<Reaction, Integer> {

    @Query("""
        SELECT COUNT(r.id)
        FROM Reaction r
        WHERE r.comment.id = :commentId
            AND r.type = :type
            AND r.status = :status
    """)
    Integer countByCommentIdAndType(Integer commentId, ReactionType type, Status status);

    Optional<Reaction> findByUser_IdAndComment_Id(Integer userId, Integer commentId);
}
