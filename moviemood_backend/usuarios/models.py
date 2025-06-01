import uuid
from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin

class UsuarioManager(BaseUserManager):
    def create_user(self, email, senha, nome, cpf, cargo, **extra_fields):
        if not email:
            raise ValueError("O e-mail é obrigatório.")
        email = self.normalize_email(email)
        user = self.model(email=email, nome=nome, cpf=cpf, cargo=cargo, **extra_fields)
        user.set_password(senha)
        user.codigo_confirmacao = str(uuid.uuid4())  # Gerando o código único
        user.save(using=self._db)
        return user

    def create_superuser(self, email, senha, nome, cpf, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        return self.create_user(email, senha, nome, cpf, cargo="gerente", **extra_fields)

class Usuario(AbstractBaseUser, PermissionsMixin):
    nome = models.CharField(max_length=255)
    cpf = models.CharField(max_length=11, unique=True)
    email = models.EmailField(unique=True)
    senha = models.CharField(max_length=255)
    cargo = models.CharField(max_length=10, choices=[('usuario', 'Usuário'), ('gerente', 'Gerente')])
    is_active = models.BooleanField(default=False)  # Cadastro inativo até confirmação
    is_staff = models.BooleanField(default=False)   # Apenas para gerentes
    codigo_confirmacao = models.CharField(max_length=36, blank=True, null=True, unique=True)  # Código de confirmação

    objects = UsuarioManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['nome', 'cpf', 'cargo']

class CodigoConfirmacao(models.Model):
    cpf = models.CharField(max_length=11, unique=True)
    codigo = models.CharField(max_length=6)
    dados = models.JSONField()  # Armazena os dados temporários (ex: nome, email, etc.)
    criado_em = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Confirmação CPF: {self.cpf} | Código: {self.codigo}"