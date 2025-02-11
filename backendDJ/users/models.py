import datetime
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
    fecha_creacion_obra = models.DateField(auto_now_add=True)
    fecha_cierre_obra = models.DateField(null=True, blank=True)

    def __str__(self):
        return self.nombreObra
    
    def cerrar_obra(self):
        self.estadoObra = False
        self.fecha_cierre_obra = datetime.date.today()
        self.save()

        almacenes = Almacenes.objects.filter(obra=self)
        for almacen in almacenes:
            almacen.cerrar_almacen()
    
class Almacenes(models.Model):
    nombreAlmacen = models.CharField(max_length=50)
    estadoAlmacen = models.BooleanField(default=True)
    obra = models.ForeignKey(Obras, on_delete=models.CASCADE, null=True, blank=True)

    def cerrar_almacen(self):
        self.estadoAlmacen = False
        self.save()

        equipos = Equipos.objects.filter(almacen=self)
        for equipo in equipos:
            equipo.estadoDisponibilidad = "no disponible"  # Ajustar estado según las reglas de negocio
            equipo.save()

    def __str__(self):
        return self.nombreAlmacen

class Usuarios(models.Model):
    nombreUsuario = models.CharField(max_length=50)
    apellido = models.CharField(max_length=50)
    telefono = models.CharField(max_length=50, unique=True)
    correo = models.EmailField(max_length=100, unique=True, null=True, blank=True)
    password = models.CharField(max_length=255)
    ci = models.CharField(max_length=50, unique=True)
    departamento = models.CharField(max_length=50)
    fecha_creacion = models.DateTimeField(auto_now_add=True)
    activo = models.BooleanField(default=True)
    obra = models.ForeignKey(Obras, on_delete=models.CASCADE,null=True, blank=True)
    imagen_url = models.URLField(
        max_length=500, 
        default='https://localimg.s3.us-east-2.amazonaws.com/imagenes/pph.png'
    )

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

class Equipos(models.Model):
    codigoEquipo = models.CharField(max_length=50, unique=True)
    nombreEquipo = models.CharField(max_length=50)
    marcaEquipo = models.CharField(max_length=50)
    modeloEquipo = models.CharField(max_length=50)
    estadoEquipo = models.BooleanField(default=True)
    estadoDisponibilidad = models.CharField(max_length=20,default='disponible')
    vidaUtilEquipo = models.CharField(max_length=20, default='0')  # ojo años o horas  numero 
    fechaAdquiscion = models.DateField()
    fechaFabricacion = models.DateField()
    horasUso = models.FloatField(default=0) 
    edadEquipo = models.CharField(max_length=20, default='0')
    imagenEquipos_url = models.URLField(max_length=500,null=True, blank=True)
    cantMantPreventivos = models.PositiveIntegerField(default=0)
    cantMantCorrectivos = models.PositiveIntegerField(default=0)
    numFallasReportdas = models.PositiveIntegerField(default=0)

    almacen = models.ForeignKey(Almacenes, on_delete=models.CASCADE, null=True, blank=True)


    def __str__(self):
        return self.nombreEquipo
    
    



class Mantenimientos(models.Model):
    TIPO_MANTENIMIENTO_CHOICES = [
        ('preventivo', 'Preventivo'),
        ('correctivo', 'Correctivo'),
    ]
    fechaInicio = models.DateField()
    fechaFin = models.DateField()
    detalleMantenimiento = models.TextField()
    responsable = models.CharField(max_length=100)
    tipo_mantenimiento = models.CharField(max_length=20, choices=TIPO_MANTENIMIENTO_CHOICES)  # Tipo de mantenimiento
    equipo = models.ForeignKey(Equipos, on_delete=models.CASCADE)

    def save(self, *args, **kwargs):
        if self.fechaInicio > self.fechaFin:
            raise ValueError("La fecha de inicio no puede ser mayor que la fecha de fin.")
        super().save(*args, **kwargs)
    def __str__(self):
        return f'Mantenimiento {self.fechaInicio} - {self.fechaFin}'
    

class UsoSolicitudesEquipos(models.Model):
    codigoSolicitud = models.CharField(max_length=50)
    fecha_solicitud = models.DateField()  # Fecha en que se realiza la solicitud
    fecha_retorno_estimada = models.DateField()  # Fecha estimada para el retorno del equipo
    fecha_retorno_real = models.DateField(null=True, blank=True)  # Fecha real de retorno del equipo
    estado = models.CharField(max_length=20, choices=[
        ('pendiente', 'Pendiente'),
        ('completada', 'Completada'),
        ('cancelada', 'Cancelada'),
        ('en uso', 'En Uso')

    ])
    motivo_uso = models.TextField(null=True, blank=True)  # Motivo de la solicitud
    fecha_uso = models.DateField()  # Fecha en que se utilizó el equipo
    equipo = models.ForeignKey(Equipos, on_delete=models.CASCADE)  # Equipo utilizado
    usuario = models.ForeignKey(Usuarios, on_delete=models.CASCADE)  # Usuario que utilizó el equipo
    descripcion_falla = models.TextField(null=True, blank=True)  # Descripción de cómo se utilizó el equipo
    cantidad_fallas_solicitud = models.PositiveIntegerField(default=0)  # Nueva propiedad para la cantidad de fallas
    horas_uso_solicitud = models.PositiveIntegerField(default=0)  # Horas de uso estimadas

    def __str__(self):
        return f'Solicitud de {self.equipo} por {self.usuario} el {self.fecha_solicitud}'

class HistorialTraspasosEquipos(models.Model):
    equipo = models.ForeignKey(Equipos, on_delete=models.CASCADE)
    obra_origen = models.ForeignKey(Obras, on_delete=models.CASCADE, related_name='traspasos_origen', null=True, blank=True)
    obra_destino = models.ForeignKey(Obras, on_delete=models.CASCADE, related_name='traspasos_destino', null=True, blank=True)
    almacen_origen = models.ForeignKey(Almacenes, related_name='almacen_origen', on_delete=models.CASCADE)
    almacen_destino = models.ForeignKey(Almacenes, related_name='almacen_destino', on_delete=models.CASCADE)
    fecha_traspaso = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'Traspaso de {self.equipo} de {self.almacen_origen} a {self.almacen_destino} el {self.fecha_traspaso}'