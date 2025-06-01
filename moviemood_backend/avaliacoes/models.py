from django.db import models
from django.conf import settings
from filmes.models import Filme

class Avaliacao(models.Model):
    usuario = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    filme = models.ForeignKey(Filme, on_delete=models.CASCADE)
    texto = models.TextField()
    sentimento = models.CharField(max_length=20)
    nota = models.FloatField()
    criado_em = models.DateTimeField(auto_now_add=True)
    sentimento_texto = models.TextField(null=True, blank=True) 

    class Meta:
        unique_together = ('usuario', 'filme')

    def __str__(self):
        return f"{self.usuario.username} - {self.filme.nome} ({self.nota})"
