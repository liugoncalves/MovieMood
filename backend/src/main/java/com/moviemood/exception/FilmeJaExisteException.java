package com.moviemood.exception;

public class FilmeJaExisteException extends RuntimeException {
    public FilmeJaExisteException(String message) {
        super(message);
    }
}
