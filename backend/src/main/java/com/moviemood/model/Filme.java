package com.moviemood.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
public class Filme {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @NotBlank(message = "O nome do filme é obrigatório!")
    private String nome;

    @NotBlank(message = "A sinopse do filme é obrigatória!")
    private String sinopse;

    @NotBlank(message = "O nome do Diretor é obrigatório!")
    private String diretor;

    @NotBlank(message = "O gênero do filme é obrigatório!")
    private String genero;

    @NotNull(message="O ano de lançamento do filme é obrigatório!")
    @Max(value=2025, message="O ano não pode ser maior que o atual.")
    private Integer ano;

    public Filme() {
    }

    public Filme(String nome, String sinopse, String diretor, String genero, Integer ano) {
        this.nome = nome;
        this.sinopse = sinopse;
        this.diretor = diretor;
        this.genero = genero;
        this.ano = ano;
    }

    @Override
    public String toString(){
        return "Filme: " + '\n' +
            "nome: " + nome + '\n' +
            "descrição: " + sinopse + '\n' + 
            "diretor: " + diretor + '\n' + 
            "genero: " + genero + '\n' + 
            "ano: " + ano + '\n';
    }
}
