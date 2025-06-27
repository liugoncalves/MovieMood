from django.urls import path
from .views import AvaliarFilmeView, ListaAvaliacoesView, ConsultarAvaliacaoView, ListaAvaliacoesUsuarioView

urlpatterns = [
    path('avaliar/', AvaliarFilmeView.as_view(), name='avaliar-filme'),
    path('listar/', ListaAvaliacoesView.as_view(), name='listar-avaliacoes'),
    path('consultar/<int:filme_id>/', ConsultarAvaliacaoView.as_view(), name='consultar-avaliacao'),
    path('minhas-avaliacoes/', ListaAvaliacoesUsuarioView.as_view(), name='lista-avaliacoes-usuario'),

]
