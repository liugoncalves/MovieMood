package com.moviemood.handler;

import java.util.HashMap;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import com.moviemood.exception.FilmeJaExisteException;
import com.moviemood.exception.FilmeNaoEncontradoException;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(FilmeJaExisteException.class)
    public ResponseEntity<Map<String, String>> handleFilmeDuplicado(FilmeJaExisteException ex) {
        Map<String, String> error = new HashMap<>();
        error.put("erro", ex.getMessage());
        return ResponseEntity.status(HttpStatus.CONFLICT).body(error); // HTTP 409
    }

    @ExceptionHandler(FilmeNaoEncontradoException.class)
    public ResponseEntity<Map<String, String>> handleFilmeNaoEncontrado(FilmeNaoEncontradoException ex) {
        Map<String, String> error = new HashMap<>();
        error.put("erro", ex.getMessage());
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error); // HTTP 404
    }

    // Opcional: tratamento genérico para qualquer exceção não prevista
    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, String>> handleException(Exception ex) {
        Map<String, String> error = new HashMap<>();
        error.put("erro", "Ocorreu um erro inesperado.");
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error); // HTTP 500
    }
}
