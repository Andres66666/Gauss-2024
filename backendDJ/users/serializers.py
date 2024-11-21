from rest_framework import serializers
from .models import (
    Roles,
    Permisos,
    Obras,
    Almacenes,
    Equipos,
    Usuarios,
    UsuarioRoles,
    RolPermisos,
    Mantenimientos,
    UsoSolicitudesEquipos,
    HistorialTraspasosEquipos,
)

class RolSerializer(serializers.ModelSerializer):
    class Meta:
        model = Roles
        fields = '__all__'

class PermisoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Permisos
        fields = '__all__'

class ObrasSerializer(serializers.ModelSerializer):
    class Meta:
        model = Obras
        fields = '__all__'

class AlmacenesSerializer(serializers.ModelSerializer):
    obra = ObrasSerializer(read_only=True)  # Consider allowing write access if needed

    class Meta:
        model = Almacenes
        fields = '__all__'

class EquiposSerializer(serializers.ModelSerializer):
    almacen = AlmacenesSerializer(read_only=True)
    class Meta:
        model = Equipos
        fields = '__all__'

class UsuarioSerializer(serializers.ModelSerializer):
    obra = ObrasSerializer(read_only=True)

    class Meta:
        model = Usuarios
        fields = '__all__'

class UsuarioRolSerializer(serializers.ModelSerializer):
    usuario = UsuarioSerializer(read_only=True)
    rol = RolSerializer(read_only=True)

    class Meta:
        model = UsuarioRoles
        fields = '__all__'

class RolPermisoSerializer(serializers.ModelSerializer):
    rol = RolSerializer(read_only=True)
    permiso = PermisoSerializer(read_only=True)

    class Meta:
        model = RolPermisos
        fields = '__all__'

class MantenimientosSerializer(serializers.ModelSerializer):
    equipo = EquiposSerializer(read_only=True)

    class Meta:
        model = Mantenimientos
        fields = '__all__'

class UsoSolicitudesEquiposSerializer(serializers.ModelSerializer):
    equipo = EquiposSerializer(read_only=True)
    usuario = UsuarioSerializer(read_only=True)

    class Meta:
        model = UsoSolicitudesEquipos
        fields = '__all__'

class HistorialTraspasosEquiposSerializer(serializers.ModelSerializer):
    equipo = EquiposSerializer(read_only=True)
    obra_origen = ObrasSerializer(read_only=True)
    obra_destino = ObrasSerializer(read_only=True)
    almacen_origen = AlmacenesSerializer(read_only=True)
    almacen_destino = AlmacenesSerializer(read_only=True)

    class Meta:
        model = HistorialTraspasosEquipos
        fields = '__all__'

class LoginSerializer(serializers.Serializer):
    correo = serializers.EmailField(max_length=100, required=False, allow_null=True)
    password = serializers.CharField(max_length=255, required=True)