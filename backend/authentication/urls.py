from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView

from .views import (
    UserCreateAPIView,
    TokenLoginAPIView,
    TokenLogoutAPIView,
    UserInfoAPIView,
    ChangePasswordAPIView,
    AdminResetPasswordAPIView,
    UserUpdateAPIView,
    UserListAPIView,
    UserDeleteAPIView
)

urlpatterns = [
    # Autenticación y sesión
    path('users/login/', TokenLoginAPIView.as_view(), name='token-login'),
    path('users/logout/', TokenLogoutAPIView.as_view(), name='token-logout'),
    path('users/token/refresh/', TokenRefreshView.as_view(), name='token-refresh'),

    # Usuario actual
    path('users/me/', UserInfoAPIView.as_view(), name='user-info'),
    path('users/me/change-password/', ChangePasswordAPIView.as_view(), name='change-password'),

    # Gestión de usuarios (solo admin)
    path('users/create/', UserCreateAPIView.as_view(), name='user-create'),
    path('users/reset-password/', AdminResetPasswordAPIView.as_view(), name='reset-password'),
    path('users/', UserListAPIView.as_view(), name='user-list'),
    path('users/<int:user_id>/update/', UserUpdateAPIView.as_view(), name='user-update'),
    path('users/<int:user_id>/delete/', UserDeleteAPIView.as_view(), name='user-delete'),
]
