from django.db import models

class Filme(models.Model):
    nome = models.CharField(max_length=100)
    descricao = models.TextField()
    genero = models.CharField(max_length=50)
    diretor = models.CharField(max_length=100)
    ano = models.IntegerField()

    def __str__(self):
        return self.nome
