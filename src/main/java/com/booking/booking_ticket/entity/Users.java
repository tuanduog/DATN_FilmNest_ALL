package com.booking.booking_ticket.entity;

import com.booking.booking_ticket.utils.UserRole;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

import java.time.OffsetDateTime;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "users")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties({ "hibernateLazyInitializer", "handler" })
public class Users {

    @Id
    @Column(name = "user_id", nullable = false)
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer userId;

    @Column(name = "username", length = 255, nullable = false)
    private String username;

    @Column(name = "password", length = 255, nullable = false)
    private String password;

    @Column(name = "email", length = 255, nullable = false)
    private String email;

    @Column(name = "phone_number", length = 50, nullable = false)
    private String phone;

    @Column(name = "gender", length = 255, nullable = false)
    private String gender;

    @Column(name = "dob", length = 255, nullable = false)
    private LocalDate dob;

    @Column(name = "nationality", length = 255, nullable = false)
    private String nationality;

    @Column(name = "membership", length = 50, nullable = false)
    private String membership;

    @Column(name = "start_date", nullable = false)
    private OffsetDateTime startDate;

    @Column(name = "expired", nullable = false)
    private Integer expired;

    @Column(name = "role", length = 50, nullable = false)
    @Enumerated(EnumType.STRING)
    private UserRole userRole;

    // @OneToMany(mappedBy = "user")
    // @ToString.Exclude
    // private Set<Cart> setCart = new HashSet();

    // @OneToMany(mappedBy = "user")
    // @ToString.Exclude
    // private Set<Comments> setComments = new HashSet();

    // @OneToMany(mappedBy = "user")
    // @ToString.Exclude
    // private Set<Comment_likes> setCommentLike = new HashSet();

    // @OneToMany(mappedBy = "user")
    // @ToString.Exclude
    // private Set<Booking> setBookings = new HashSet();

    // @OneToMany(mappedBy = "user")
    // @ToString.Exclude
    // private Set<Reviews> setReviews = new HashSet();

}
