# forms.py
from django import forms
from .models import Usuarios

class UsuarioForm(forms.ModelForm):
    class Meta:
        model = Usuarios
        fields = ('nombreUsuario', 'apellido', 'telefono', 'correo', 'password', 'ci', 'obra', 'imagen', 'imagen_url')

    def __init__(self, *args, **kwargs):
        super(UsuarioForm, self).__init__(*args, **kwargs)
        self.fields['imagen'].required = True  # Asegúrate de que el campo 'imagen' sea requerido

