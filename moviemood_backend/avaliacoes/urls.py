from django.urls import path
from .views import AvaliarFilmeView, ListaAvaliacoesView

urlpatterns = [
    path('avaliar/', AvaliarFilmeView.as_view(), name='avaliar-filme'),
    path('listar/', ListaAvaliacoesView.as_view(), name='listar-avaliacoes'),
]
