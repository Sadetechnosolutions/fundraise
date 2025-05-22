package com.sadetech.fundraiser.exception;

public class RequestTimeoutException extends RuntimeException{
    public RequestTimeoutException(String message) {
        super(message);
    }
}
