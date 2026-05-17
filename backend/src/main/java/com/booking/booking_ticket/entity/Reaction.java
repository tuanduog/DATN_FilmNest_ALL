package com.booking.booking_ticket.entity;

import com.booking.booking_ticket.utils.ReactionType;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "reaction")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Reaction extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "comment_id")
    private Comment comment;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private Users user;

    @Enumerated(EnumType.STRING)
    private ReactionType type;
}
