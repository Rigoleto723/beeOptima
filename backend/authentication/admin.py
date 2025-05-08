from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from django.contrib.auth.models import Group
from .models import CustomUser
from .forms import CustomUserCreationForm, CustomUserChangeForm

@admin.register(CustomUser)
class CustomAdminUser(UserAdmin):
    add_form = CustomUserCreationForm
    form = CustomUserChangeForm
    model = CustomUser

    list_display = ("username", "first_name", "last_name", "email", "status", "get_groups")
    list_filter = ("status", "groups")
    search_fields = ("username", "email", "first_name", "last_name")
    ordering = ("username",)

    fieldsets = (
        (None, {"fields": ("username", "email", "password")}),
        ("Información personal", {"fields": ("first_name", "last_name")}),
        ("Estado y seguridad", {"fields": ("status",)}),
        ("Grupos y permisos", {"fields": ("groups", "is_staff", "is_superuser")}),
    )

    add_fieldsets = (
        (None, {
            "classes": ("wide",),
            "fields": ("username", "email", "first_name", "last_name", "status", "groups"),
        }),
    )

    filter_horizontal = ("groups",)

    def get_groups(self, obj):
        """Muestra los grupos del usuario en la lista del panel de administración."""
        return ", ".join([group.name for group in obj.groups.all()])
    
    get_groups.short_description = "Grupo(s)"

    def save_model(self, request, obj, form, change):
        """Asigna permisos administrativos automáticamente si el grupo es 'Administrador'."""
        super().save_model(request, obj, form, change)

        if obj.groups.filter(name="Administrador").exists():
            obj.is_superuser = True
            obj.is_staff = True
        else:
            obj.is_superuser = False
            obj.is_staff = False

        obj.save()
