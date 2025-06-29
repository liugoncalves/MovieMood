from rest_framework.views import APIView
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny
from .models import Filme
from .serializers import FilmeSerializer
import unicodedata

class CadastrarFilmeView(APIView):
    parser_classes = [MultiPartParser, FormParser]

    def post(self, request):
        serializer = FilmeSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({'mensagem': 'Filme cadastrado com sucesso'}, status=201)
        return Response(serializer.errors, status=400)
class ListarFilmesView(APIView):
    permission_classes = [AllowAny]
    def get(self, request):
        filmes = Filme.objects.all()
        serializer = FilmeSerializer(filmes, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

class ConsultarFilmeView(APIView):
    def get(self, request, filme_id):
        try:
            filme = Filme.objects.get(id=filme_id)
            serializer = FilmeSerializer(filme)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Filme.DoesNotExist:
            return Response({'erro': 'Filme não encontrado'}, status=status.HTTP_404_NOT_FOUND)

class AtualizarFilmeView(APIView):
    def put(self, request, filme_id):
        try:
            filme = Filme.objects.get(id=filme_id)
        except Filme.DoesNotExist:
            return Response({'erro': 'Filme não encontrado'}, status=status.HTTP_404_NOT_FOUND)

        serializer = FilmeSerializer(filme, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response({'mensagem': 'Filme atualizado com sucesso'}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class DeletarFilmeView(APIView):
    def delete(self, request, filme_id):
        try:
            filme = Filme.objects.get(id=filme_id)
            filme.delete()
            return Response({'mensagem': 'Filme deletado com sucesso'}, status=status.HTTP_200_OK)
        except Filme.DoesNotExist:
            return Response({'erro': 'Filme não encontrado'}, status=status.HTTP_404_NOT_FOUND)

class RankingFilmesView(APIView):
    def get(self, request):
        ordem = request.query_params.get('ordem', 'melhores')

        if ordem == 'piores':
            filmes = (Filme.objects
                      .filter(numero_avaliacoes__gt=0)
                      .order_by('nota_media', '-numero_avaliacoes')[:10])
        else:  # padrão: melhores
            filmes = (Filme.objects
                      .filter(numero_avaliacoes__gt=0)  
                      .order_by('-nota_media', '-numero_avaliacoes')[:10])

        serializer = FilmeSerializer(filmes, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
        
def normalize_text(text):
    text = text.lower()
    text = unicodedata.normalize('NFKD', text).encode('ASCII', 'ignore').decode('utf-8')
    text = text.replace('-', ' ').strip()
    return text

class FiltrarFilmesView(APIView):
    def get(self, request):
        genero = request.query_params.get('genero', None)
        ano = request.query_params.get('ano', None)
        ordem_nota = request.query_params.get('ordem_nota', None)

        filtros = {}

        if genero:
            filtros['genero__iexact'] = genero.strip()
        if ano:
            filtros['ano'] = ano

        filmes = Filme.objects.filter(**filtros)

        if ordem_nota == 'asc':
            filmes = filmes.order_by('nota_media')
        elif ordem_nota == 'desc':
            filmes = filmes.order_by('-nota_media')

        serializer = FilmeSerializer(filmes, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)