package com.moviemood.service;

import java.text.Normalizer;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.moviemood.exception.FilmeJaExisteException;
import com.moviemood.exception.FilmeNaoEncontradoException;
import com.moviemood.model.Filme;
import com.moviemood.repository.FilmeRepository;

@Service
public class FilmeService {

    @Autowired
    private FilmeRepository filmeRepository;

    public Filme salvarFilme(Filme filme) {
        List<Filme> filmesExistentes = filmeRepository.findAll();
    
        String nomeNovo = normalizarTexto(filme.getNome());
        String diretorNovo = normalizarTexto(filme.getDiretor());
    
        boolean filmeJaExiste = filmesExistentes.stream()
            .anyMatch(f -> 
                normalizarTexto(f.getNome()).equals(nomeNovo) &&
                normalizarTexto(f.getDiretor()).equals(diretorNovo)
            );
    
        if (filmeJaExiste) {
            throw new FilmeJaExisteException("Este diretor já tem esse filme cadastrado no sistema.");
        }
    
        return filmeRepository.save(filme);
    }
    
    
    
    public List<Filme> listarTodos(){
        return filmeRepository.findAll();
    }

    public Filme buscarFilmePorId(Long id) {
        return filmeRepository.findById(id)
                .orElseThrow(() -> new FilmeNaoEncontradoException("Filme não encontrado."));
    }
    
    public void deletarFilmePorId(Long id) {
        Filme filme = filmeRepository.findById(id)
                .orElseThrow(() -> new FilmeNaoEncontradoException("Filme não encontrado."));
        filmeRepository.delete(filme);
    }
    
    private String normalizarTexto(String texto) {
        String semAcento = Normalizer.normalize(texto, Normalizer.Form.NFD)
                                      .replaceAll("[\\p{InCombiningDiacriticalMarks}]", "");
        String semSimbolos = semAcento.replaceAll("[^\\p{Alnum}]", ""); // Remove TUDO que não é letra ou número
        return semSimbolos.toLowerCase(); // Transforma em minúsculo
    }
    
}