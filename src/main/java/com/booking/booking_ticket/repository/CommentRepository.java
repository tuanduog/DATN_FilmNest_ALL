package com.booking.booking_ticket.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.booking.booking_ticket.entity.Comments;

@Repository
public interface CommentRepository extends JpaRepository<Comments, Integer> {

    List<Comments> findByMovie_IdOrderByCreatedAtAsc(Integer movieId);
}
