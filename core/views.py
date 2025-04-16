from django.shortcuts import render
from django.shortcuts import get_object_or_404
from .models import Filme
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAdminUser
from .serializers import FilmeSerializer

def home(request):
    return render(request, "index.html")

# API: listar todos os filmes (aberto ao público)
@api_view(['GET'])
def listar_filmes(request):
    filmes = Filme.objects.all()
    serializer = FilmeSerializer(filmes, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def consultar_filme(request, id):
    filme = get_object_or_404(Filme, id=id)

    serializer = FilmeSerializer(filme)

    return Response(serializer.data)



# API: adicionar filme (somente admin)
@api_view(['POST'])
#@permission_classes([IsAdminUser])
def adicionar_filme(request):
    serializer = FilmeSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['DELETE'])
#@permission_classes([IsAdminUser])
def deletar_filme(request, id):
    filme = get_object_or_404(Filme, id=id)

    filme.delete()

    return Response(status=status.HTTP_204_NO_CONTENT)
