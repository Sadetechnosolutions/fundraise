package com.sadetech.fundraiser.exception;

import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.context.request.WebRequest;

import java.time.LocalDateTime;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(InvalidTokenException.class)
    public ErrorResponse handleInvalidTokenException(InvalidTokenException ex, WebRequest request) {
        return new ErrorResponse(
                ex.getMessage(),
                401,
                "InvalidTokenException",
                request.getDescription(false),
                LocalDateTime.now()
        );
    }

    @ExceptionHandler(ResourceNotFoundException.class)
    public ErrorResponse handleResourceNotFoundException(ResourceNotFoundException ex, WebRequest request) {
        return new ErrorResponse(
                ex.getMessage(),
                404,
                "ResourceNotFoundException",
                request.getDescription(false),
                LocalDateTime.now()
        );
    }

    @ExceptionHandler(UnAuthorizedAccessException.class)
    public ErrorResponse handleUnAuthorizedAccessException(UnAuthorizedAccessException ex, WebRequest request) {
        return new ErrorResponse(
                ex.getMessage(),
                403,
                "UnAuthorizedAccessException",
                request.getDescription(false),
                LocalDateTime.now()
        );
    }

    @ExceptionHandler(InvalidPhoneNumberException.class)
    public ErrorResponse handleInvalidPhoneNumberException(InvalidPhoneNumberException ex, WebRequest request) {
        return new ErrorResponse(
                ex.getMessage(),
                400,
                "InvalidPhoneNumberException",
                request.getDescription(false),
                LocalDateTime.now()
        );
    }

    @ExceptionHandler(InvalidOtpException.class)
    public ErrorResponse handleInvalidOtpException(InvalidOtpException ex, WebRequest request) {
        return new ErrorResponse(
                ex.getMessage(),
                400,
                "InvalidOtpException",
                request.getDescription(false),
                LocalDateTime.now()
        );
    }

    @ExceptionHandler(OtpExpiredException.class)
    public ErrorResponse handleOtpExpiredException(OtpExpiredException ex, WebRequest request) {
        return new ErrorResponse(
                ex.getMessage(),
                400,
                "OtpExpiredException",
                request.getDescription(false),
                LocalDateTime.now()
        );
    }

    @ExceptionHandler(Exception.class)
    public ErrorResponse handleException(Exception ex, WebRequest request) {
        return new ErrorResponse(
                ex.getMessage(),
                500,
                "Exception",
                request.getDescription(false),
                LocalDateTime.now()
        );
    }

}
