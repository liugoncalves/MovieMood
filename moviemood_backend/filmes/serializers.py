from rest_framework import serializers
from .models import Filme

class FilmeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Filme
        fields = '__all__'
        read_only_fields = ['nota_media', 'numero_avaliacoes']

    def to_representation(self, instance):
        ret = super().to_representation(instance)
        # Retorna só o nome do arquivo, se existir
        if ret.get('poster'):
            ret['poster'] = ret['poster'].split('/')[-1]
        return ret
