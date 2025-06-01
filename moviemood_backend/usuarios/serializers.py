from rest_framework import serializers
from .models import Usuario
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    username_field = 'email'

    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        # Adiciona o cargo no payload do token
        token['cargo'] = user.cargo  
        token['nome'] = user.nome
        token['cpf'] = user.cpf

        return token

    def validate(self, attrs):
        data = super().validate(attrs)
        # Também retorna no JSON da resposta
        data['cargo'] = self.user.cargo
        data['nome'] = self.user.nome
        data['cpf'] = self.user.cpf
        return data

class UsuarioCadastroSerializer(serializers.Serializer):
    nome = serializers.CharField(max_length=100)
    cpf = serializers.CharField(max_length=11)
    email = serializers.EmailField()
    senha = serializers.CharField(write_only=True, min_length=6)
    cargo = serializers.ChoiceField(choices=[('usuario', 'Usuário'), ('gerente', 'Gerente')])

class UsuarioListagemSerializer(serializers.ModelSerializer):
    class Meta:
        model = Usuario
        fields = ['id', 'nome', 'cpf', 'email', 'cargo', 'is_active']

class UsuarioAtualizacaoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Usuario
        fields = ['nome', 'email', 'senha', 'cargo']
        extra_kwargs = {
            'senha': {'write_only': True, 'required': False},
            'email': {'required': False}
        }
