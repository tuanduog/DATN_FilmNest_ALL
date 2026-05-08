package com.booking.booking_ticket.utils;


import jakarta.validation.Constraint;
import jakarta.validation.Payload;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Target({ElementType.FIELD})
@Retention(RetentionPolicy.RUNTIME)
@Constraint(
        validatedBy = {EmailValidator.class}
)
public @interface EmailConstraint {
    String message() default "Email không hợp lệ.";

    Class<?>[] groups() default {};

    Class<? extends Payload>[] payload() default {};
}
