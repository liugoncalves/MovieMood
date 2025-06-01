import unicodedata
from django.db import models

def normalize_text(text):
    text = text.lower()
    text = unicodedata.normalize('NFKD', text).encode('ASCII', 'ignore').decode('utf-8')
    text = text.replace('-', ' ').strip()
    return text

class Filme(models.Model):
    id = models.AutoField(primary_key=True)
    nome = models.CharField(max_length=255)
    descricao = models.TextField()
    diretor = models.CharField(max_length=255)
    genero = models.CharField(max_length=100)
    ano = models.PositiveIntegerField()
    nota_media = models.FloatField(default=0.0)
    numero_avaliacoes = models.PositiveIntegerField(default=0)
    poster = models.ImageField(upload_to='posters/', blank=True, null=True)

    class Meta:
        unique_together = ('nome', 'diretor', 'ano')

    def save(self, *args, **kwargs):
        # Normaliza o gênero antes de salvar
        self.genero = normalize_text(self.genero)
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.nome} ({self.ano}) - {self.diretor}"
