from django.db import models
from django.contrib.auth.models import AbstractUser

class CustomUser(AbstractUser):
    pass
    STATUS_CHOICES = [
        ("active", "Activo"),
        ("inactive", "Inactivo"),
    ]

    username = models.CharField(max_length=15, unique=True)
    first_name = models.CharField(max_length=150)
    last_name = models.CharField(max_length=150)
    email = models.EmailField(unique=True)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default="active")
    
    USERNAME_FIELD = "username"
    REQUIRED_FIELDS = ["email", "first_name", "last_name",]
    
    def __str__(self):
        return f"{self.username} ({', '.join([group.name for group in self.groups.all()])})"
    
    def reset_password(self):
        """Restablece la contraseña del usuario a la predeterminada y marca que debe cambiarse."""
        self.set_password("12345678")
        self.must_change_password = True
        self.save()
    
    def change_password(self, old_password, new_password, confirm_password):
        """Permite al usuario cambiar su contraseña si introduce la actual correctamente."""
        if not self.check_password(old_password):
            raise ValueError("La contraseña actual es incorrecta.")
        if new_password != confirm_password:
           raise ValueError("Las nuevas contraseñas no coinciden.")
        if len(new_password) < 8:
            raise ValueError("La nueva contraseña debe tener al menos 8 caracteres.")
        self.set_password(new_password)
        self.save()
    
    def has_role(self, role_name):
        return self.groups.filter(name=role_name).exists()