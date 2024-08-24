from rest_framework import serializers
from django.contrib.auth import get_user_model, authenticate
from django.core.exceptions import ValidationError
from django.contrib.auth.models import Group
from django.contrib.auth.hashers import check_password

UserModel = get_user_model()

class UserRegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserModel
        fields = '__all__'
    def create(self, clean_data):
        group_name = clean_data.pop('group') 
        user_obj = UserModel.objects.create_user(username=clean_data['username'], password=clean_data['password'], group_name=group_name)
        user_obj.name = clean_data['name']
        user_obj.surname = clean_data['surname']
        user_obj.save()
        return user_obj

class UserUpdateSerializer(serializers.ModelSerializer):
    username = serializers.CharField(required=False)
    name = serializers.CharField(required=False)
    surname = serializers.CharField(required=False)
    group = serializers.CharField(required=False)

    class Meta:
        model = UserModel
        fields = ['username', 'name', 'surname', 'group']

class UserLoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField()
    ##
    def check_user(self, clean_data):
        user = authenticate(username=clean_data['username'], password=clean_data['password'])
        if not user:
            raise ValidationError('user not found')
        return user

class ChangePasswordSerializer(serializers.Serializer):
    current = serializers.CharField(required=True)
    newPass = serializers.CharField(required=True)

    def validate_current(self, value):
        user = self.context['request'].user
        if not check_password(value, user.password):
            raise serializers.ValidationError("La contraseña actual es incorrecta.")
        return value

    def save(self):
        user = self.context['request'].user
        user.set_password(self.validated_data['newPass'])
        user.save()
        return user

class GroupSerializer(serializers.ModelSerializer):
    class Meta:
        model = Group
        fields = ('name',)

class UserSerializer(serializers.ModelSerializer):
    groups = GroupSerializer(many=True, read_only=True)

    class Meta:
        model = UserModel
        fields = ('username', 'name', 'surname', 'groups')
