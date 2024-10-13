from django.contrib.auth.hashers import make_password
from users.models import Usuario

# Cifra la contraseña del usuario 'andy'
usuario = Usuario.objects.get(nombreUsuario='pepE')
usuario.password = make_password('1234')  # Reemplaza '1234' con la contraseña actual en texto plano
usuario.save()

""" exec(open('scripts/encriptar_contrasenas.py').read())
"""