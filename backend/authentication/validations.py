from django.core.exceptions import ValidationError
from django.contrib.auth import get_user_model
UserModel = get_user_model()

def custom_validation(data):
    username = data['username'].strip()
    password = data['password'].strip()
    ##
    if not username or UserModel.objects.filter(username=username).exists():
        raise ValidationError('TAKEN')
    ##
    if not password or len(password) < 8:
        raise ValidationError('LENGHT')
    return data

def validate_username(data):
    username = data['username'].strip()
    if not username:
        raise ValidationError('a username is needed')
    return True

def validate_password(data):
    password = data['password'].strip()
    if not password:
        raise ValidationError('a password is needed')
    return True