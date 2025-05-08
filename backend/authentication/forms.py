from django.contrib.auth.forms import UserCreationForm, UserChangeForm
from .models import CustomUser

class CustomUserCreationForm(UserCreationForm):
    """Formulario para crear un nuevo usuario desde el panel de administración."""
    class Meta:
        model = CustomUser
        fields = ("username", "first_name", "last_name", "email", "groups", "status")

    def save(self, commit=True):
        user = super().save(commit=False)
        user.set_password("12345678")  # Asigna la contraseña por defecto
        if commit:
            user.save()
        return user


class CustomUserChangeForm(UserChangeForm):
    """Formulario para actualizar un usuario en el panel de administración."""
    class Meta:
        model = CustomUser
        fields = ("username", "first_name", "last_name", "email", "groups", "status")