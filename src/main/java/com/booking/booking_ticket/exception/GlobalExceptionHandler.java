package com.booking.booking_ticket.exception;

import jakarta.validation.ConstraintViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;

import java.util.Date;

@RestControllerAdvice
public class GlobalExceptionHandler {
    @ExceptionHandler({MethodArgumentNotValidException.class, ConstraintViolationException.class})
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ErrorResponse handlerValidationException(Exception e, WebRequest request)
    {

        System.out.println("=============> HandlerValidationException");
        ErrorResponse errorResponse = new ErrorResponse();
        errorResponse.setTimestamp(new Date());
        errorResponse.setStatus(HttpStatus.BAD_REQUEST.value());
        errorResponse.setPath(request.getDescription(false).replace("uri=",""));
        if(e instanceof MethodArgumentNotValidException)
        {
            errorResponse.setError(HttpStatus.BAD_REQUEST.getReasonPhrase());
            String  message = e.getMessage();
            int start  = message.lastIndexOf("[");
            int end   = message.lastIndexOf("]");
            message = message.substring(start + 1, end - 1);
            errorResponse.setError("Payload invalid ");

            errorResponse.setMessage(message);
        }
        else if(e instanceof ConstraintViolationException)
        {
            errorResponse.setError("Pathvariable Invalid");
            String message = e.getMessage();
            message = message.substring(message.indexOf(" ") + 1);
            errorResponse.setMessage(message);
        }
        
        return errorResponse;
    }

    @ExceptionHandler({MethodArgumentTypeMismatchException.class})
    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    public ErrorResponse handlerInternalServerErrorException(Exception e, WebRequest request)
    {
        System.out.println("=============> Interal Server Error");
        ErrorResponse errorResponse = new ErrorResponse();
        errorResponse.setStatus(HttpStatus.INTERNAL_SERVER_ERROR.value());
        errorResponse.setPath(request.getDescription(false).replace("uri=",""));
        errorResponse.setError(HttpStatus.INTERNAL_SERVER_ERROR.getReasonPhrase());
        if(e instanceof  MethodArgumentTypeMismatchException)
        {
            errorResponse.setMessage("Failed to convert value of type");

        }


        return errorResponse;

    }
}
