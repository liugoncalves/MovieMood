from django.urls import path
from .views import CadastroUsuarioView, ConfirmarCadastroView, ListarUsuariosView, ConsultarUsuarioView, AtualizarUsuarioView, DeletarUsuarioView, UsuarioMeAPIView

urlpatterns = [
    path('cadastrar/', CadastroUsuarioView.as_view(), name='cadastrar-usuario'),
    path('confirmar/', ConfirmarCadastroView.as_view(), name='confirmar-usuario'),  
    path('listar/', ListarUsuariosView.as_view(), name='listar-usuarios'),
    path('consultar/<str:cpf>/', ConsultarUsuarioView.as_view(), name='consultar-usuario'),
    path('atualizar/<str:cpf>/', AtualizarUsuarioView.as_view(), name='atualizar-usuario'),
    path('deletar/<str:cpf>/', DeletarUsuarioView.as_view(), name='deletar-usuario'),
    path("me/", UsuarioMeAPIView.as_view()),

]
