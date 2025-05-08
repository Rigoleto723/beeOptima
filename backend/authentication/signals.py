# authentication/signals.py

from django.db.models.signals import post_migrate
from django.dispatch import receiver
from django.contrib.auth.models import Group, Permission
from django.contrib.contenttypes.models import ContentType
from django.apps import apps

@receiver(post_migrate)
def create_default_groups(sender, **kwargs):
    if sender.name != 'authentication':
        return

    # Crear grupos
    groups_permissions = {
        "Administrador": Permission.objects.all(),
        "Usuario": [],
    }

    # Permisos por grupo y modelo
    models_by_role = {
        "Usuario": {
            "colony": ["colony"],
        },
    }

    # Permisos estándar que asignaremos
    default_perms = ["add", "change", "view"]

    for group_name, perms in groups_permissions.items():
        group, _ = Group.objects.get_or_create(name=group_name)
        
        if group_name == "Administrador":
            group.permissions.set(perms)
            print(f"✅ Grupo '{group_name}' creado con TODOS los permisos.")
        else:
            # Recolectar permisos
            perms_to_add = []
            for app_label, model_list in models_by_role.get(group_name, {}).items():
                for model_name in model_list:
                    for perm_type in default_perms:
                        codename = f"{perm_type}_{model_name}"
                        try:
                            permission = Permission.objects.get(codename=codename, content_type__app_label=app_label)
                            perms_to_add.append(permission)
                        except Permission.DoesNotExist:
                            print(f"⚠️ Permiso {codename} en app {app_label} no encontrado.")
            group.permissions.set(perms_to_add)
            print(f"✅ Grupo '{group_name}' creado con permisos específicos.")

