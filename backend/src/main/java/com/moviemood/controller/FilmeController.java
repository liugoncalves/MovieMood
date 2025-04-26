package com.moviemood.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.moviemood.model.Filme;
import com.moviemood.service.FilmeService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/filmes")
public class FilmeController {

    @Autowired
    private FilmeService filmeService;

    @PostMapping
    public ResponseEntity<Filme> criarFilme(@Valid @RequestBody Filme filme) {
        Filme novoFilme = filmeService.salvarFilme(filme);
        return new ResponseEntity<>(novoFilme, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<Filme>> listarFilmes(){
        List<Filme> filmes = filmeService.listarTodos();
        return ResponseEntity.ok(filmes);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Filme> buscarFilmePorId(@PathVariable Long id) {
        Filme filme = filmeService.buscarFilmePorId(id);
        return ResponseEntity.ok(filme);
    }

    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletarFilmePorId(@PathVariable Long id){
        filmeService.deletarFilmePorId(id);
        return ResponseEntity.noContent().build();
    }
}
