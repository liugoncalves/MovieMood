from rest_framework import serializers
from .models import Filme

GENERO_FORMATADO = {
    "acao": "Ação",
    "animacao": "Animação",
    "aventura": "Aventura",
    "cinebiografia": "Cinebiografia",
    "comedia": "Comédia",
    "crime": "Crime",
    "drama": "Drama",
    "esporte": "Esporte",
    "fantasia": "Fantasia",
    "faroeste": "Faroeste",
    "ficcao cientifica": "Ficção Científica",
    "guerra": "Guerra",
    "horror": "Horror",
    "misterio": "Mistério",
    "musical": "Musical",
    "romance": "Romance",
    "suspense": "Suspense",
}

class FilmeSerializer(serializers.ModelSerializer):
    poster = serializers.ImageField(required=False, allow_null=True)

    class Meta:
        model = Filme
        fields = '__all__'
        read_only_fields = ['nota_media', 'numero_avaliacoes']

    def to_representation(self, instance):
        ret = super().to_representation(instance)
        if ret.get('poster'):
            ret['poster'] = ret['poster'].split('/')[-1]
        genero_raw = ret.get('genero', '').lower()
        ret['genero'] = GENERO_FORMATADO.get(genero_raw, genero_raw.title())
        return ret
