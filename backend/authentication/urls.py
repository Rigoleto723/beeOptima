from django.urls import path
from . import views

urlpatterns = [
    path('login/', views.UserLogin.as_view(), name='login'),
    path('register/', views.UserRegister.as_view(), name='register'),
    path('logout/', views.UserLogout.as_view(), name='logout'),
    path('user/', views.UserView.as_view(), name='user'),
    path('users/', views.UserListView.as_view(), name='user-list'),
    path('users/<str:username>/reset_password/', views.UserManagementView.as_view(), name='reset_user_password'),
]
