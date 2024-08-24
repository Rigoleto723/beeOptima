from django.db import models
from django.contrib.auth.base_user import BaseUserManager
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin, Group

class AppUserManager(BaseUserManager):
    def create_user(self, username, password=None, group_name='Cashier'):
        if not password:
            raise ValueError('A password is required.')
        group = Group.objects.get(name=group_name)
        user = self.model(username=username)
        user.set_password(password)
        user.save()
        user.groups.add(group)
        return user

    def create_superuser(self, username, password=None):
        if not password:
            raise ValueError('A password is required.')
        user = self.create_user(username, password)
        user.is_superuser = True
        user.save()
        return user

class AppUser(AbstractBaseUser, PermissionsMixin):
    username = models.CharField(max_length=50, primary_key=True)
    name = models.CharField(max_length=256)
    surname = models.CharField(max_length=256)
    group = models.CharField(max_length=50, null=True, blank=True)
    
    USERNAME_FIELD = 'username'
    objects = AppUserManager()

    def __str__(self):
        return self.username

    def get_full_name(self):
        return self.name + ' ' + self.surname