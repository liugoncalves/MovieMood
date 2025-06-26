from django.urls import path
from django.conf import settings
from django.conf.urls.static import static
from .views import (CadastrarFilmeView, ListarFilmesView, ConsultarFilmeView, AtualizarFilmeView,
                     DeletarFilmeView, RankingFilmesView, FiltrarFilmesView)

urlpatterns = [
    path('cadastrar/', CadastrarFilmeView.as_view(), name='cadastrar-filme'),
    path('listar/', ListarFilmesView.as_view(), name='listar-filmes'),
    path('consultar/<int:filme_id>', ConsultarFilmeView.as_view(), name='consultar-filme'),
    path('atualizar/<int:filme_id>', AtualizarFilmeView.as_view(), name='atualizar-filme'),
    path('deletar/<int:filme_id>', DeletarFilmeView.as_view(), name='deletar-filme'),
    path('ranking/', RankingFilmesView.as_view(), name='ranking-filmes'),
    path('filtrar/', FiltrarFilmesView.as_view(), name='filtrar-filmes'),

] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
