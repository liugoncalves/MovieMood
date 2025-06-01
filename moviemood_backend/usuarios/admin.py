from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import Usuario

class UsuarioAdmin(UserAdmin):
    model = Usuario
    list_display = ('cpf', 'email', 'nome', 'cargo', 'is_active', 'is_staff')
    list_filter = ('cargo', 'is_active')
    search_fields = ('cpf', 'email', 'nome')
    ordering = ('cpf',)

    fieldsets = (
        (None, {'fields': ('cpf', 'email', 'nome', 'senha', 'cargo')}),
        ('Permissões', {'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')}),
    )

    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('cpf', 'email', 'nome', 'cargo', 'senha1', 'senha2', 'is_active', 'is_staff', 'is_superuser')}
        ),
    )

admin.site.register(Usuario, UsuarioAdmin)
