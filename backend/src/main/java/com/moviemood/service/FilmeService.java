package com.moviemood.backend.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.moviemood.backend.exception.FilmeJaExisteException;
import com.moviemood.backend.model.Filme;
import com.moviemood.backend.repository.FilmeRepository;

@Service
public class FilmeService {

    @Autowired
    private FilmeRepository filmeRepository;

    public Filme salvarFilme(Filme filme) {
        if (filmeRepository.existsByNomeAndDiretor(filme.getNome(), filme.getDiretor())) {
            throw new FilmeJaExisteException("Este diretor já tem um filme com esse nome cadastrado.");
        }
        return filmeRepository.save(filme);
    }

    public List<Filme> listarTodos(){
        return filmeRepository.findAll();
    }
}