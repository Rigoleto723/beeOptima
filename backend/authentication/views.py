from rest_framework import status, serializers
from rest_framework.generics import (
    GenericAPIView, RetrieveAPIView, UpdateAPIView, ListAPIView, DestroyAPIView
)
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.exceptions import TokenError
from django.contrib.auth import login, logout
from .models import CustomUser
from .permissions import IsAdminUser
from .serializers import (
    CustomUserSerializer,
    UserRegistrationSerializer,
    UserLoginSerializer,
    ChangePasswordSerializer,
    ResetPasswordSerializer,
    UserUpdateSerializer
)

# --- Helpers ---
def get_user_by_id(user_id):
    """Función auxiliar para recuperar un usuario por ID."""
    return CustomUser.objects.get(id=user_id)

# --- Vistas ---
class UserCreateAPIView(GenericAPIView):
    """Vista para registrar nuevos usuarios (solo admin debería usarla)."""
    permission_classes = (IsAuthenticated, IsAdminUser)
    serializer_class = UserRegistrationSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(
            {"message": "Usuario registrado correctamente."},
            status=status.HTTP_201_CREATED
        )

class TokenLoginAPIView(GenericAPIView):
    """Vista para iniciar sesión y obtener tokens JWT."""
    permission_classes = (AllowAny,)
    serializer_class = UserLoginSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data

        login(request, user)  # Login opcional para sesiones
        token = RefreshToken.for_user(user)

        return Response({
            "user": CustomUserSerializer(user).data,
            "tokens": {"refresh": str(token), "access": str(token.access_token)},
        }, status=status.HTTP_200_OK)

class TokenLogoutAPIView(GenericAPIView):
    """Vista para cerrar sesión e invalidar el token de refresco."""
    permission_classes = (IsAuthenticated,)

    def post(self, request, *args, **kwargs):
        refresh_token = request.data.get("refresh")

        if not refresh_token:
            return Response(
                {"error": "Token de refresco requerido."},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            token = RefreshToken(refresh_token)
            token.blacklist()
            logout(request)
            return Response({"message": "Sesión cerrada correctamente."}, status=status.HTTP_205_RESET_CONTENT)
        except TokenError as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

class UserInfoAPIView(RetrieveAPIView):
    """Vista para obtener la información del usuario autenticado."""
    permission_classes = (IsAuthenticated,)
    serializer_class = CustomUserSerializer

    def get_object(self):
        return self.request.user

class ChangePasswordAPIView(GenericAPIView):
    """Vista para que los usuarios cambien su propia contraseña."""
    permission_classes = (IsAuthenticated,)
    serializer_class = ChangePasswordSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data, context={"request": request})
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response({"message": "Contraseña cambiada exitosamente."}, status=status.HTTP_200_OK)

class AdminResetPasswordAPIView(GenericAPIView):
    """Vista para que el admin reseteé la contraseña de un usuario a una predeterminada."""
    permission_classes = (IsAuthenticated, IsAdminUser)
    serializer_class = ResetPasswordSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response({"message": "Contraseña reseteada a '12345678'."}, status=status.HTTP_200_OK)

class UserUpdateAPIView(UpdateAPIView):
    """Vista para actualizar información de un usuario específico."""
    permission_classes = (IsAuthenticated, IsAdminUser)
    serializer_class = UserUpdateSerializer

    def get_object(self):
        return get_user_by_id(self.kwargs.get('user_id'))

class UserListAPIView(ListAPIView):
    """Vista para listar todos los usuarios (solo admin)."""
    permission_classes = (IsAuthenticated, IsAdminUser)
    serializer_class = CustomUserSerializer

    def get_queryset(self):
        return CustomUser.objects.all().order_by('username')

class UserDeleteAPIView(DestroyAPIView):
    """Vista para eliminar un usuario (solo admin)."""
    permission_classes = (IsAuthenticated, IsAdminUser)
    serializer_class = CustomUserSerializer

    def get_object(self):
        return get_user_by_id(self.kwargs.get('user_id'))

    def perform_destroy(self, instance):
        if instance == self.request.user:
            raise serializers.ValidationError("No puedes eliminar tu propio usuario.")
        instance.delete()