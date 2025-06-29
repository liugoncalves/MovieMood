import uuid
from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin

class UsuarioManager(BaseUserManager):
    def create_user(self, email, password=None, nome=None, cpf=None, cargo="usuario", **extra_fields):
        if not email:
            raise ValueError("O e-mail é obrigatório.")
        if not nome:
            raise ValueError("O nome é obrigatório.")
        if not cpf:
            raise ValueError("O CPF é obrigatório.")

        email = self.normalize_email(email)
        user = self.model(email=email, nome=nome, cpf=cpf, cargo=cargo, **extra_fields)
        user.set_password(password)
        user.codigo_confirmacao = str(uuid.uuid4())
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, nome=None, cpf=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('is_active', True)  # Ativa o superusuário automaticamente
        cargo = "gerente"
        if not password:
            raise ValueError("Superuser precisa ter uma senha.")
        return self.create_user(email, password, nome, cpf, cargo=cargo, **extra_fields)

class Usuario(AbstractBaseUser, PermissionsMixin):
    nome = models.CharField(max_length=255)
    cpf = models.CharField(max_length=11, unique=True)
    email = models.EmailField(unique=True)
    cargo = models.CharField(max_length=10, choices=[('usuario', 'Usuário'), ('gerente', 'Gerente')])
    is_active = models.BooleanField(default=False)
    is_staff = models.BooleanField(default=False)
    codigo_confirmacao = models.CharField(max_length=36, blank=True, null=True, unique=True)

    objects = UsuarioManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['nome', 'cpf']

class CodigoConfirmacao(models.Model):
    cpf = models.CharField(max_length=11, unique=True)
    codigo = models.CharField(max_length=6)
    dados = models.JSONField()  # Armazena os dados temporários (ex: nome, email, etc.)
    criado_em = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Confirmação CPF: {self.cpf} | Código: {self.codigo}"