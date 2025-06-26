import random
import uuid
from django.core.mail import send_mail
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from .models import Usuario
from django.conf import settings
from .serializers import UsuarioListagemSerializer, UsuarioAtualizacaoSerializer
from .models import CodigoConfirmacao 
from rest_framework_simplejwt.views import TokenObtainPairView 
from .serializers import MyTokenObtainPairSerializer


class CadastroUsuarioView(APIView):
    def post(self, request):
        nome = request.data.get('nome')
        cpf = request.data.get('cpf')
        email = request.data.get('email')
        senha = request.data.get('senha')
        cargo = request.data.get('cargo', 'usuario')

        if Usuario.objects.filter(cpf=cpf).exists():
            return Response({'erro': 'CPF já cadastrado'}, status=status.HTTP_400_BAD_REQUEST)
        if Usuario.objects.filter(email=email).exists():
            return Response({'erro': 'E-mail já cadastrado'}, status=status.HTTP_400_BAD_REQUEST)

        codigo = random.randint(100000, 999999)

        CodigoConfirmacao.objects.update_or_create(
            cpf=cpf,
            defaults={'codigo': str(codigo), 'dados': request.data}
        )

        send_mail(
            'Confirmação de cadastro - MovieMood',
            f'Seu código de confirmação é: {codigo}',
            settings.EMAIL_HOST_USER,
            [email],
            fail_silently=False,
        )

        return Response({'mensagem': 'Código enviado para o email'}, status=status.HTTP_200_OK)


class ConfirmarCadastroView(APIView):
    def get(self, request):
        cpf = request.query_params.get('cpf')
        codigo = request.query_params.get('codigo')

        try:
            confirmacao = CodigoConfirmacao.objects.get(cpf=cpf)
        except CodigoConfirmacao.DoesNotExist:
            return Response({'erro': 'Nenhum cadastro pendente para este CPF'}, status=status.HTTP_400_BAD_REQUEST)

        if confirmacao.codigo != codigo:
            return Response({'erro': 'Código incorreto'}, status=status.HTTP_400_BAD_REQUEST)

        dados = confirmacao.dados
        confirmacao.delete()  # remove o registro após confirmação

        try:
            usuario = Usuario.objects.get(cpf=cpf)
            if usuario.email != dados['email']:
                usuario.email = dados['email']
                usuario.is_active = True
                usuario.codigo_confirmacao = ''
                usuario.save()
                return Response({'mensagem': 'E-mail confirmado com sucesso!'}, status=status.HTTP_200_OK)
            else:
                return Response({'mensagem': 'O e-mail já está confirmado!'}, status=status.HTTP_200_OK)
        except Usuario.DoesNotExist:
            usuario = Usuario.objects.create_user(
                nome=dados['nome'],
                cpf=dados['cpf'],
                email=dados['email'],
                senha=dados['senha'],
                cargo=dados.get('cargo', 'usuario')
            )
            usuario.is_active = True
            usuario.save()
            return Response({'mensagem': 'Cadastro confirmado com sucesso!'}, status=status.HTTP_200_OK)


class ListarUsuariosView(APIView):
    def get(self, request):
        usuarios = Usuario.objects.all()
        serializer = UsuarioListagemSerializer(usuarios, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
class ConsultarUsuarioView(APIView):
    def get(self, request, cpf):
        try:
            usuario = Usuario.objects.get(cpf=cpf)
            serializer = UsuarioListagemSerializer(usuario)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Usuario.DoesNotExist:
            return Response({'erro': 'Usuário não encontrado'}, status=status.HTTP_404_NOT_FOUND)

class AtualizarUsuarioView(APIView):
    def put(self, request, cpf):
        try:
            usuario = Usuario.objects.get(cpf=cpf)
        except Usuario.DoesNotExist:
            return Response({'erro': 'Usuário não encontrado'}, status=status.HTTP_404_NOT_FOUND)

        dados = request.data
        email_antigo = usuario.email

        serializer = UsuarioAtualizacaoSerializer(usuario, data=dados, partial=True)
        if serializer.is_valid():
            nome = serializer.validated_data.get('nome', usuario.nome)
            cargo = serializer.validated_data.get('cargo', usuario.cargo)
            nova_senha = serializer.validated_data.get('senha')
            novo_email = serializer.validated_data.get('email')

            if novo_email and novo_email != email_antigo:
                codigo = random.randint(100000, 999999)
                CodigoConfirmacao.objects.update_or_create(
                    cpf=cpf,
                    defaults={
                        'codigo': str(codigo),
                        'dados': {
                            'nome': nome,
                            'email': novo_email,
                            'senha': nova_senha,
                            'cargo': cargo
                        }
                    }
                )

                send_mail(
                    'Confirme seu novo email - MovieMood',
                    f'Seu novo código de confirmação é: {codigo}',
                    settings.EMAIL_HOST_USER,
                    [novo_email],
                    fail_silently=False,
                )
                return Response({'mensagem': 'Código enviado para o novo email'}, status=status.HTTP_200_OK)

            if nova_senha:
                usuario.set_password(nova_senha)

            usuario.nome = nome
            usuario.cargo = cargo
            usuario.save()

            return Response({'mensagem': 'Usuário atualizado com sucesso'}, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    
class DeletarUsuarioView(APIView):
    def delete(self, request, cpf):
        try:
            usuario = Usuario.objects.get(cpf=cpf)
            usuario.delete()  # Deleta o usuário
            return Response({'mensagem': 'Usuário deletado com sucesso!'}, status=status.HTTP_200_OK)
        except Usuario.DoesNotExist:
            return Response({'erro': 'Usuário não encontrado'}, status=status.HTTP_404_NOT_FOUND)


class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer

class UsuarioMeAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        serializer = UsuarioListagemSerializer(request.user)
        return Response(serializer.data)