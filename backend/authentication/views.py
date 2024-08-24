from django.contrib.auth import get_user_model, login, logout
from rest_framework.authentication import SessionAuthentication
from rest_framework.views import APIView
from rest_framework.response import Response
from .serializers import UserRegisterSerializer, UserLoginSerializer, UserSerializer, UserUpdateSerializer, ChangePasswordSerializer
from rest_framework import permissions, status
from rest_framework.permissions import IsAuthenticated, BasePermission
from .validations import custom_validation
from django.core.exceptions import ValidationError
from django.contrib.auth.models import Group, User
from django.shortcuts import get_object_or_404
from django.contrib.auth import update_session_auth_hash

UserModel = get_user_model()

class IsAdminUser(BasePermission):
    """
    Custom permission to only allow users in 'Admin' group to access the view.
    """
    def has_permission(self, request, view):
        admin_group = Group.objects.get(name='Admin')
        return bool(request.user and request.user.groups.filter(name=admin_group).exists())

UserModel = get_user_model()

class UserManagementView(APIView):
    #permission_classes = [IsAuthenticated, IsAdminUser]

    def post(self, request, username):
        try:
            user = UserModel.objects.get(username=username)
        except UserModel.DoesNotExist:
            return Response({"detail": "User not found."}, status=status.HTTP_404_NOT_FOUND)
        
        # Contraseña predeterminada
        default_password = "12345678"
        
        user.set_password(default_password)
        user.save()
        return Response({"detail": "Password reset successfully."}, status=status.HTTP_200_OK)

class UserRegister(APIView):
    permission_classes = (permissions.AllowAny,)
    def post(self, request):
        serializer = UserRegisterSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Registro exitoso"}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        
        #try:
            #clean_data = custom_validation(request.data)
        #except Exception as e:
         #   return Response({'message': e}, status=status.HTTP_400_BAD_REQUEST)
        #serializer = UserRegisterSerializer(data=clean_data)
        #if serializer.is_valid():
         #   user = serializer.create(clean_data)
          #  if user:
           #     return Response(status=status.HTTP_201_CREATED)
        #return Response(status=status.HTTP_400_BAD_REQUEST)

class UserLogin(APIView):
    #permission_classes = (permissions.AllowAny,)
    #authentication_classes = (SessionAuthentication,)
    ##
    def post(self, request):
        data = request.data
        #assert validate_username(data)
        #assert validate_password(data)
        serializer = UserLoginSerializer(data=data)
        if serializer.is_valid(raise_exception=True):
            try:
                user = serializer.check_user(data)
                login(request, user)
                return Response(serializer.data, status=status.HTTP_200_OK)
            except ValidationError:
                return Response(status=status.HTTP_404_NOT_FOUND)
                
class UserLogout(APIView):
    #permission_classes = (permissions.AllowAny,)
    #authentication_classes = ()
    def post(self, request):
        logout(request)
        return Response(status=status.HTTP_200_OK)

class UserView(APIView):
    #permission_classes = (permissions.IsAuthenticated,)
    #authentication_classes = (SessionAuthentication,)
    ##
    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response({'user': serializer.data}, status=status.HTTP_200_OK)
    

class UserListView(APIView):
    #permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        # Check if the user belongs to the 'Admin' group
        admin_group = Group.objects.filter(name='Admin').first()
        if admin_group and request.user.groups.filter(id=admin_group.id).exists():
            # Retrieve all users
            users = UserModel.objects.all()
            serializer = UserSerializer(users, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            return Response({'message': 'Unauthorized'}, status=status.HTTP_403_FORBIDDEN)