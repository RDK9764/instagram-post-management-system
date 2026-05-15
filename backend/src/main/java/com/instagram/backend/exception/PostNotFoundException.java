package com.instagram.backend.exception;

public class PostNotFoundException
        extends RuntimeException {

    public PostNotFoundException(String message) {

        super(message);
    }
}