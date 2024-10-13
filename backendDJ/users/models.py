from django.db import models
from django.contrib.auth.hashers import make_password

class Roles(models.Model):
    nombreRol = models.CharField(max_length=50, unique=True)
    activo = models.BooleanField(default=True)
    def __str__(self):
        return self.nombreRol

class Permisos(models.Model):
    nombre = models.CharField(max_length=50, unique=True)
    descripcion = models.TextField(null=True, blank=True)
    activo = models.BooleanField(default=True)

    def __str__(self):
        return self.nombre

class Obras(models.Model):
    nombreObra = models.CharField(max_length=50)
    ubicacionObra = models.CharField(max_length=100)
    estadoObra = models.BooleanField(default=True)

    def __str__(self):
        return self.nombreObra
    
class Usuarios(models.Model):
    nombreUsuario = models.CharField(max_length=50)
    apellido = models.CharField(max_length=50)
    telefono = models.CharField(max_length=50, unique=True)
    correo = models.EmailField(max_length=100, unique=True, null=True, blank=True)
    password = models.CharField(max_length=255)
    ci = models.CharField(max_length=50, unique=True)
    fecha_creacion = models.DateTimeField(auto_now_add=True)
    activo = models.BooleanField(default=True)
    obra = models.ForeignKey(Obras, on_delete=models.CASCADE)
    imagen = models.FileField(upload_to='imagenes/')
    imagen_url = models.URLField(max_length=500,null=True, blank=True)

    def save(self, *args, **kwargs):
        if not self.password.startswith('pbkdf2'):
            self.password = make_password(self.password)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.nombreUsuario


class UsuarioRoles(models.Model):
    usuario = models.ForeignKey(Usuarios, on_delete=models.CASCADE)
    rol = models.ForeignKey(Roles, on_delete=models.CASCADE)

    class Meta:
        unique_together = ('usuario', 'rol')
    def __str__(self):
        return f'{self.usuario} - {self.rol}'

class RolPermisos(models.Model):
    rol = models.ForeignKey(Roles, on_delete=models.CASCADE)
    permiso = models.ForeignKey(Permisos, on_delete=models.CASCADE)
    
    class Meta:
        unique_together = ('rol', 'permiso')
    def __str__(self):
        return f'{self.rol} - {self.permiso}'


class Almacenes(models.Model):
    nombreAlmacen = models.CharField(max_length=50)
    estadoAlmacen = models.BooleanField(default=True)
    obra = models.ForeignKey(Obras, on_delete=models.CASCADE)

    def __str__(self):
        return self.nombreAlmacen

class Equipos(models.Model):
    nombreEquipo = models.CharField(max_length=50)
    marca = models.CharField(max_length=50)
    modelo = models.CharField(max_length=50)
    estadoEquipo = models.BooleanField(default=True)
    estadoUsoEquipo = models.CharField(max_length=20, choices=[
        ('Disponible', 'Disponible'),
        ('En uso', 'En uso'),
        ('En mantenimiento', 'En mantenimiento')
    ])
    vidaUtil = models.CharField(max_length=20)  # años o horas
    fechaAdquiscion = models.DateField()
    almacen = models.ForeignKey(Almacenes, on_delete=models.CASCADE)
    imagenEquipos = models.FileField(upload_to='imagenes/')
    imagenEquipos_url = models.URLField(max_length=500,null=True, blank=True)

    def __str__(self):
        return self.nombreEquipo
    
class Mantenimientos(models.Model):
    fechaInicio = models.DateField()
    fechaFin = models.DateField()
    tipoMantenimiento = models.CharField(max_length=100)
    estadoMantenimiento = models.BooleanField(default=True) 
    detalleMantenimiento = models.TextField()
    responsable = models.CharField(max_length=100)
    equipo = models.ForeignKey(Equipos, on_delete=models.CASCADE)

    def __str__(self):
        return f'Mantenimiento {self.fechaInicio} - {self.fechaFin}'

class Solicitudes(models.Model):
    fechaSolicitud = models.DateField()
    fechaRetornoEstimada = models.DateField()
    fechaRetornoReal = models.DateField()
    equipo = models.ForeignKey(Equipos, on_delete=models.CASCADE)
    obra = models.ForeignKey(Obras, on_delete=models.CASCADE)
    usuario = models.ForeignKey(Usuarios, on_delete=models.CASCADE)

    def __str__(self):
        return f'Solicitud {self.fechaSolicitud}'

