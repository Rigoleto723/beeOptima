from rest_framework import serializers
from django.contrib.auth import authenticate
from django.contrib.auth.models import Group
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.conf import settings
from .models import CustomUser


class GroupSerializer(serializers.ModelSerializer):
    class Meta:
        model = Group
        fields = ("id", "name")


class CustomUserSerializer(serializers.ModelSerializer):
    """Serializador para mostrar información básica del usuario."""
    groups = GroupSerializer(many=True, read_only=True)

    class Meta:
        model = CustomUser
        fields = ("id", "username", "first_name", "last_name", "email", "groups", "status")


class UserRegistrationSerializer(serializers.ModelSerializer):
    """Serializador para registrar nuevos usuarios."""
    group = serializers.CharField(write_only=True)

    class Meta:
        model = CustomUser
        fields = ("id", "username", "first_name", "last_name", "email", "group", "status")

    def validate_group(self, value):
        """Verifica que el grupo ingresado sea válido."""
        if not Group.objects.filter(name=value).exists():
            raise serializers.ValidationError("El grupo ingresado no es válido.")
        return value

    def create(self, validated_data):
        group_name = validated_data.pop("group")
        user = CustomUser.objects.create(**validated_data)
        user.set_password(settings.DEFAULT_USER_PASSWORD)

        group = Group.objects.get(name=group_name)
        user.groups.add(group)

        if group_name == "admin":
            user.is_superuser = True
            user.is_staff = True

        user.save()
        return user


class UserLoginSerializer(serializers.Serializer):
    """Serializador para el inicio de sesión."""
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        """Autenticación del usuario."""
        user = authenticate(username=data["username"], password=data["password"])
        if not user or not user.is_active:
            raise serializers.ValidationError("Cédula o contraseña incorrectas.")
        return user


class ChangePasswordSerializer(serializers.Serializer):
    """Serializador para permitir a los usuarios cambiar su contraseña."""
    old_password = serializers.CharField(write_only=True)
    new_password = serializers.CharField(write_only=True)
    confirm_password = serializers.CharField(write_only=True)

    def validate(self, data):
        user = self.context["request"].user

        if not user.check_password(data["old_password"]):
            raise serializers.ValidationError("La contraseña actual es incorrecta.")
        if data["new_password"] != data["confirm_password"]:
            raise serializers.ValidationError("Las nuevas contraseñas no coinciden.")
        if len(data["new_password"]) < 8:
            raise serializers.ValidationError("La nueva contraseña debe tener al menos 8 caracteres.")

        return data

    def save(self, **kwargs):
        user = self.context["request"].user
        user.set_password(self.validated_data["new_password"])
        user.save()
        return user


class ResetPasswordSerializer(serializers.Serializer):
    """Serializador para que el admin pueda resetear la contraseña de un usuario."""
    user_id = serializers.IntegerField()

    def validate(self, data):
        try:
            user = CustomUser.objects.get(id=data["user_id"])
            data["user"] = user
        except CustomUser.DoesNotExist:
            raise serializers.ValidationError("Usuario no encontrado.")
        return data

    def save(self, **kwargs):
        user = self.validated_data["user"]
        user.reset_password()
        return user


class UserUpdateSerializer(serializers.ModelSerializer):
    """Serializador para actualizar información del usuario."""
    groups = serializers.ListField(child=serializers.CharField(), write_only=True, required=False)

    class Meta:
        model = CustomUser
        fields = ['first_name', 'last_name', 'email', 'groups', 'status']
        read_only_fields = ['username']

    def update(self, instance, validated_data):
        groups_data = validated_data.pop('groups', None)

        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        if groups_data is not None:
            groups = Group.objects.filter(name__in=groups_data)
            if len(groups) != len(groups_data):
                missing = set(groups_data) - set(groups.values_list("name", flat=True))
                raise serializers.ValidationError(f"Los siguientes grupos no existen: {', '.join(missing)}")
            instance.groups.set(groups)

        instance.save()
        return instance


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    """Token personalizado que incluye datos del usuario."""

    def validate(self, attrs):
        data = super().validate(attrs)

        data["user"] = {
            "id": self.user.id,
            "username": self.user.username,
            "first_name": self.user.first_name,
            "last_name": self.user.last_name,
            "email": self.user.email,
            "groups": [group.name for group in self.user.groups.all()],
            "status": self.user.status,
        }

        return data