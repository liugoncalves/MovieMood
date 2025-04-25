package com.moviemood.backend.handler;

import java.util.HashMap;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import com.moviemood.backend.exception.FilmeJaExisteException;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(FilmeJaExisteException.class)
    public ResponseEntity<Map<String, String>> handleFilmeDuplicado(FilmeJaExisteException ex) {
        Map<String, String> error = new HashMap<>();
        error.put("erro", ex.getMessage());
        return ResponseEntity.status(HttpStatus.CONFLICT).body(error);
    }
}
