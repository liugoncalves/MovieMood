from rest_framework.views import APIView
from rest_framework.generics import ListAPIView
from rest_framework.response import Response
from rest_framework import status
from .models import Avaliacao
from .serializers import AvaliacaoSerializer
from .utils import analisar_sentimento
from filmes.models import Filme
from rest_framework.permissions import IsAuthenticated

class AvaliarFilmeView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = AvaliacaoSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            texto = serializer.validated_data['texto']
            filme = serializer.validated_data['filme']
            usuario = request.user

            if Avaliacao.objects.filter(usuario=usuario, filme=filme).exists():
                return Response({'erro': 'Usuário já avaliou este filme'}, status=status.HTTP_400_BAD_REQUEST)

            sentimento, nota, texto_gerado = analisar_sentimento(texto)

            avaliacao = serializer.save(sentimento=sentimento, nota=nota, sentimento_texto=texto_gerado)

            # Atualiza nota média
            avaliacoes = Avaliacao.objects.filter(filme=filme)
            media = sum(a.nota for a in avaliacoes) / avaliacoes.count()
            filme.nota_media = round(media, 2)
            filme.numero_avaliacoes = avaliacoes.count()
            filme.save()

            return Response(AvaliacaoSerializer(avaliacao).data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    
class ListaAvaliacoesView(ListAPIView):
    queryset = Avaliacao.objects.all().order_by('-criado_em')
    serializer_class = AvaliacaoSerializer
    permission_classes = [IsAuthenticated]
