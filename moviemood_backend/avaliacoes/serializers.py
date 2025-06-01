from rest_framework import serializers
from .models import Avaliacao

class AvaliacaoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Avaliacao
        fields = ['id', 'usuario', 'filme', 'texto', 'sentimento', 'nota', 'criado_em', 'sentimento_texto']
        read_only_fields = ['usuario', 'sentimento', 'nota', 'criado_em']
    
    def create(self, validated_data):
        usuario = self.context['request'].user
        return Avaliacao.objects.create(usuario=usuario, **validated_data)
