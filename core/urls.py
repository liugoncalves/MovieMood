from django.urls import path
from .views import home, listar_filmes, adicionar_filme, deletar_filme, consultar_filme

urlpatterns = [
    path('', home),  # HTML: Hello World
    path('filmes/', listar_filmes),  # API GET
    path('filmes/consultar/<int:id>', consultar_filme), #API GET
    path('filmes/add', adicionar_filme),  # API POST (admin)
    path('filmes/delete/<int:id>', deletar_filme)
]
