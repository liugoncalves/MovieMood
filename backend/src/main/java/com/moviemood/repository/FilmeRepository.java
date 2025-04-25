package com.moviemood.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.moviemood.model.Filme;

@Repository
public interface FilmeRepository extends JpaRepository<Filme, Long>{
    boolean existsByNomeAndDiretor(String nome, String diretor);
    
}