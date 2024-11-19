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
        almacen_global = AlmacenGlobal.objects.first()  # Suponiendo que solo hay uno
        if not almacen_global:
            raise ValueError("No existe un Almacén Global definido.")
        
        for almacen in almacenes:
            equipos = Equipos.objects.filter(almacen=almacen)
            for equipo in equipos:
                HistorialTraspasosEquipos.objects.create(
                    equipo=equipo,
                    obra_origen=self,
                    obra_destino=None,
                    almacen_origen=almacen,
                    almacen_destino=almacen_global,
                )
                equipo.almacen = almacen_global
                equipo.save()
    
class Almacenes(models.Model):
    nombreAlmacen = models.CharField(max_length=50)
    estadoAlmacen = models.BooleanField(default=True)
    obra = models.ForeignKey(Obras, on_delete=models.CASCADE, null=True, blank=True)

    def cerrar_almacen(self):
        self.estadoAlmacen = False
        self.save()

        almacen_global = AlmacenGlobal.objects.first()  # Suponiendo que solo hay uno
        equipos = Equipos.objects.filter(almacen=self)
        for equipo in equipos:
            equipo.almacen = almacen_global
            equipo.save()

    def __str__(self):
        return self.nombreAlmacen
    
class AlmacenGlobal(models.Model):
    nombreAlmacen = models.CharField(max_length=50, default="Almacén Global")
    estadoAlmacen = models.BooleanField(default=True)  # Indica si el almacén está activo

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

class Equipos(models.Model):
    codigoEquipo = models.CharField(max_length=50, unique=True)
    nombreEquipo = models.CharField(max_length=50)
    marcaEquipo = models.CharField(max_length=50)
    modeloEquipo = models.CharField(max_length=50)
    estadoEquipo = models.BooleanField(default=True)
    estadoDisponibilidad = models.CharField(max_length=20)
    vidaUtilEquipo = models.CharField(max_length=20)  # años o horas  numero 
    fechaAdquiscion = models.DateField()
    fechaFabricacion = models.DateField(null=True, blank=True)
    horasUso = models.FloatField(default=0) 
    edadEquipo = models.CharField(max_length=20)
    imagenEquipos_url = models.URLField(max_length=500,null=True, blank=True)
    cantMantPreventivos = models.PositiveIntegerField(default=0)
    cantMantCorrectivos = models.PositiveIntegerField(default=0)
    numFallasReportdas = models.PositiveIntegerField(default=0)

    almacen = models.ForeignKey(Almacenes, on_delete=models.CASCADE) 
    almacen_global = models.ForeignKey(AlmacenGlobal, on_delete=models.SET_NULL, null=True, blank=True)  # Almacén global   
    def __str__(self):
        return self.nombreEquipo
    
    
class FallasEquipos(models.Model):
    fecha_falla = models.DateField()  # Fecha en que ocurrió la falla
    descripcion = models.TextField()  # Descripción de la falla
    estado = models.CharField(max_length=20, choices=[
        ('reportada', 'Reportada'),
        ('resuelta', 'Resuelta'),
    ])
    equipo = models.ForeignKey(Equipos, on_delete=models.CASCADE, related_name='fallas')  # Relación con el equipo

    def __str__(self):
        return f'Falla en {self.equipo} el {self.fecha_falla}'
    
    def save(self, *args, **kwargs):
        if not self.pk:  # Solo incrementar si es una nueva falla
            self.equipo.numFallasReportdas += 1
            self.equipo.save()
        super().save(*args, **kwargs)


class Mantenimientos(models.Model):
    TIPO_MANTENIMIENTO_CHOICES = [
        ('preventivo', 'Preventivo'),
        ('correctivo', 'Correctivo'),
    ]
    fechaInicio = models.DateField()
    fechaFin = models.DateField()
    cantMantPre = models.PositiveIntegerField(default=0)
    cantMantCor = models.PositiveIntegerField(default=0)
    estadoMantenimiento = models.BooleanField(default=True) 
    detalleMantenimiento = models.TextField()
    responsable = models.CharField(max_length=100)
    tipo_mantenimiento = models.CharField(max_length=20, choices=TIPO_MANTENIMIENTO_CHOICES)  # Tipo de mantenimiento

    equipo = models.ForeignKey(Equipos, on_delete=models.CASCADE)


    
    def save(self, *args, **kwargs):
        if self.fechaInicio > self.fechaFin:
            raise ValueError("La fecha de inicio no puede ser mayor que la fecha de fin.")
        super().save(*args, **kwargs)
        if self.tipo_mantenimiento == 'preventivo':
            self.equipo.cantMantPreventivos += 1
        elif self.tipo_mantenimiento == 'correctivo':
            self.equipo.cantMantCorrectivos += 1
        self.equipo.save()
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
        ('cancelada', 'Cancelada')
    ])
    motivo = models.TextField(null=True, blank=True)  # Motivo de la solicitud
    fecha_uso = models.DateField()  # Fecha en que se utilizó el equipo
    equipo = models.ForeignKey(Equipos, on_delete=models.CASCADE)  # Equipo utilizado
    usuario = models.ForeignKey(Usuarios, on_delete=models.CASCADE)  # Usuario que utilizó el equipo
    descripcion_uso = models.TextField(null=True, blank=True)  # Descripción de cómo se utilizó el equipo

    def __str__(self):
        return f'Solicitud de {self.equipo} por {self.usuario} el {self.fecha_solicitud}'
    def save(self, *args, **kwargs):
        if self.estado == 'completada' and self.fecha_retorno_real:
            dias_uso = (self.fecha_retorno_real - self.fecha_uso).days
            if dias_uso > 0:
                self.equipo.horasUso += dias_uso * 8  # Ejemplo: 8 horas por día
                self.equipo.save()
        super().save(*args, **kwargs)


class HistorialTraspasosEquipos(models.Model):
    equipo = models.ForeignKey(Equipos, on_delete=models.CASCADE)
    obra_origen = models.ForeignKey(Obras, on_delete=models.CASCADE, related_name='traspasos_origen')
    obra_destino = models.ForeignKey(Obras, on_delete=models.CASCADE, related_name='traspasos_destino', null=True, blank=True )
    almacen_origen = models.ForeignKey(Almacenes, related_name='almacen_origen', on_delete=models.CASCADE)
    almacen_destino = models.ForeignKey(Almacenes, related_name='almacen_destino', on_delete=models.CASCADE)
    fecha_traspaso = models.DateTimeField(auto_now_add=True)


    def __str__(self):
        return f'Traspaso de {self.equipo} de {self.almacen_origen} a {self.almacen_destino} el {self.fecha_traspaso}'

class Mierda(models.Model):
    equipoM = models.ForeignKey(Equipos, on_delete=models.CASCADE)
    obra_origenM = models.ForeignKey(Obras, on_delete=models.CASCADE, related_name='traspasos_origen')
