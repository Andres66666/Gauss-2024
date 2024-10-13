from rest_framework import viewsets
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.hashers import check_password

from .serializers import (
    AlmacenesSerializer,
    EquiposSerializer,
    MantenimientosSerializer,
    ObrasSerializer,
    RolPermisoSerializer,
    LoginSerializer,
    SolicitudesSerializer,
    UsuarioSerializer,
    RolSerializer,
    PermisoSerializer,
    UsuarioRolSerializer,
)
from .models import Obras, Almacenes, Equipos, Mantenimientos, Solicitudes, Usuarios, Roles, Permisos, UsuarioRoles, RolPermisos
import boto3
from botocore.config import Config
import json

class LoginView(APIView):
    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        correo = serializer.validated_data.get('correo')
        password = serializer.validated_data.get('password')

        try:
            usuario = Usuarios.objects.get(correo=correo)

            # Check if the user is active
            if not usuario.activo:
                return Response({'error': 'No puedes iniciar sesión!!!. Comuníquese con el administrador. Gracias.'}, status=status.HTTP_403_FORBIDDEN)
            
            if check_password(password, usuario.password):
                # Obtener roles del usuario
                usuario_roles = UsuarioRoles.objects.filter(usuario=usuario)
                roles = [usuario_rol.rol.nombreRol for usuario_rol in usuario_roles]

                # Obtener permisos asociados a los roles del usuario
                permisos = RolPermisos.objects.filter(rol__in=[usuario_rol.rol for usuario_rol in usuario_roles])
                permisos_nombres = [permiso.permiso.nombre for permiso in permisos]

                # Serializar los datos del usuario
                usuario_serializer = UsuarioSerializer(usuario)
                return Response({
                    'mensaje': 'Login exitoso',
                    'usuario': usuario_serializer.data,
                    'nombreUsuario': usuario.nombreUsuario,
                    'apellido': usuario.apellido,
                    'imagen_url': usuario.imagen_url,

                    'roles': roles,
                    'permisos': permisos_nombres
                }, status=status.HTTP_200_OK)
            else:
                return Response({'error': 'Credenciales incorrectas'}, status=status.HTTP_400_BAD_REQUEST)
        except Usuarios.DoesNotExist:
            return Response({'error': 'Usuario no encontrado'}, status=status.HTTP_400_BAD_REQUEST)


class PermisoViewSet(viewsets.ModelViewSet):
    queryset = Permisos.objects.all()
    serializer_class = PermisoSerializer


class UsuarioViewSet(viewsets.ModelViewSet):
    queryset = Usuarios.objects.all()
    serializer_class = UsuarioSerializer

    def update(self, request, pk=None):
        # Obtener la instancia del usuario a actualizar
        instance = self.get_object()

        # Obtener la URL de la imagen antigua
        old_image_url = instance.imagen_url

        # Usar el serializador para validar los datos entrantes
        serializer = self.get_serializer(instance, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)

        # Actualizar la imagen si se proporciona una nueva
        if 'imagen' in request.FILES:
            file = request.FILES['imagen']
            s3_url = self.upload_image_to_s3(file)
            instance.imagen_url = s3_url  # Guardar la nueva URL de la imagen en la base de datos

        # Actualizar los campos restantes, usando los valores actuales si no se proporcionan nuevos
        instance.nombreUsuario = request.data.get('nombreUsuario', instance.nombreUsuario)
        instance.apellido = request.data.get('apellido', instance.apellido)
        instance.telefono = request.data.get('telefono', instance.telefono)
        instance.correo = request.data.get('correo', instance.correo)
        instance.ci = request.data.get('ci', instance.ci)
        instance.activo = request.data.get('activo', instance.activo) == 'true'

        # Manejo del campo obra
        obra_data = request.data.get('obra')
        if isinstance(obra_data, str):
            obra_data = json.loads(obra_data)

        # Asignar obra_id de manera segura
        if isinstance(obra_data, dict) and 'id' in obra_data:
            instance.obra_id = obra_data['id']
        elif obra_data:
            instance.obra_id = obra_data

        # Guardar la instancia actualizada
        instance.save()

        # Retornar la imagen antigua junto con los datos actualizados
        response_data = serializer.data
        response_data['old_image_url'] = old_image_url

        return Response(response_data, status=status.HTTP_200_OK)

    def create(self, request, *args, **kwargs):
        nombreUsuario = request.data.get('nombreUsuario')
        apellido = request.data.get('apellido')
        telefono = request.data.get('telefono')
        correo = request.data.get('correo')
        password = request.data.get('password')
        ci = request.data.get('ci')
        obra_id = request.data.get('obra')

        # Subir la imagen a S3 si se proporciona
        imagen_url = None
        if 'imagen' in request.FILES:
            file = request.FILES['imagen']
            imagen_url = self.upload_image_to_s3(file)

        # Crear el usuario
        usuario = Usuarios.objects.create(
            nombreUsuario=nombreUsuario,
            apellido=apellido,
            telefono=telefono,
            correo=correo,
            password=password,
            ci=ci,
            obra_id=obra_id,
            imagen_url=imagen_url  # Guardar la URL de la imagen en la base de datos
        )
        
        return Response(UsuarioSerializer(usuario).data, status=status.HTTP_201_CREATED)

    def upload_image_to_s3(self, file):
        s3_client = boto3.client('s3',
                                aws_access_key_id='AKIAXBZV5WHW7U4O2QEF',
                                aws_secret_access_key='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',
                                config=Config(signature_version='s3v4'))

        try:
            s3_key = f"imagenes/{file.name}"
            s3_client.upload_fileobj(file, 'localimg', s3_key, ExtraArgs={'ContentType': file.content_type})
            image_url = f"https://localimg.s3.us-east-2.amazonaws.com/{s3_key}"
            return image_url
        except Exception as e:
            raise Exception(f"Error subiendo imagen a S3: {str(e)}")

class RolViewSet(viewsets.ModelViewSet):
    queryset = Roles.objects.all()
    serializer_class = RolSerializer

class UsuarioRolViewSet(viewsets.ModelViewSet):
    queryset = UsuarioRoles.objects.all()
    serializer_class = UsuarioRolSerializer
    
    def update(self, request, pk=None):
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)

        self.perform_update(serializer)
        instance.usuario_id = request.data.get('usuario', {}).get('id', instance.usuario_id)
        instance.rol_id = request.data.get('rol', {}).get('id', instance.rol_id)
        instance.save()
        return Response(serializer.data)

    def create(self, request, *args, **kwargs):
        usuario_id = request.data.get('usuario')
        rol_id = request.data.get('rol')
        # Aquí puedes realizar validaciones o lógica adicional si es necesario
        usuarirol = UsuarioRoles.objects.create(usuario_id=usuario_id, rol_id=rol_id)
        return Response(UsuarioRolSerializer(usuarirol).data, status=status.HTTP_201_CREATED)

class RolPermisoViewSet(viewsets.ModelViewSet):
    queryset = RolPermisos.objects.all()
    serializer_class = RolPermisoSerializer

    def update(self, request, pk=None):
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        instance.rol_id = request.data.get('rol', {}).get('id', instance.rol_id)
        instance.permiso_id = request.data.get('permiso', {}).get('id', instance.permiso_id)
        instance.save()
        return Response(serializer.data)
    # Sobrescribir el método de creación si es necesario
    def create(self, request, *args, **kwargs):
        rol_id = request.data.get('rol')
        permiso_id = request.data.get('permiso')
        # Aquí puedes realizar validaciones o lógica adicional si es necesario
        rolpermiso = RolPermisos.objects.create(rol_id=rol_id, permiso_id=permiso_id)
        return Response(RolPermisoSerializer(rolpermiso).data, status=status.HTTP_201_CREATED)

class ObrasViewSet(viewsets.ModelViewSet):
    queryset = Obras.objects.all()
    serializer_class = ObrasSerializer

class AlmacenesViewSet(viewsets.ModelViewSet):
    queryset = Almacenes.objects.all()
    serializer_class = AlmacenesSerializer

    def update(self, request, pk=None):
        instance = self.get_object()  # Obtener el usuario actual por su ID (pk)
        # Serializar los datos proporcionados por la solicitud
        serializer = self.get_serializer(instance, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)  # Validar datos

        # Realizar la actualización
        self.perform_update(serializer)
        # En caso de actualizar campos específicos (usuario_id, rol_id), no es necesario si es un usuario normal
        instance.nombreAlmacen = request.data.get('nombreAlmacen', instance.nombreAlmacen)
        instance.obra_id = request.data.get('obra', {}).get('id', instance.obra_id)

        # Guardar cambios
        instance.save()

        return Response(serializer.data)
    
    def create(self, request, *args, **kwargs):
        nombreAlmacen = request.data.get('nombreAlmacen')
        obra_id = request.data.get('obra')
        
        # Aquí puedes realizar validaciones o lógica adicional si es necesario
        almacen = Almacenes.objects.create(
            nombreAlmacen=nombreAlmacen,
            obra_id=obra_id
        )
        return Response(AlmacenesSerializer(almacen).data, status=status.HTTP_201_CREATED)

class EquiposViewSet(viewsets.ModelViewSet):
    queryset = Equipos.objects.all()
    serializer_class = EquiposSerializer

    def update(self, request, pk=None):
        instance = self.get_object()
        old_image_url = instance.imagenEquipos_url
        serializer = self.get_serializer(instance, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)

        # Actualizar la imagen si se proporciona una nueva
        if 'imagenEquipos' in request.FILES:
            file = request.FILES['imagenEquipos']
            s3_url = self.upload_image_to_s4(file)
            instance.imagenEquipos_url = s3_url 

        # Actualizar los campos restantes, usando los valores actuales si no se proporcionan nuevos
        instance.nombreEquipo = request.data.get('nombreEquipo', instance.nombreEquipo)
        instance.marca = request.data.get('marca', instance.marca)
        instance.modelo = request.data.get('modelo', instance.modelo)
        instance.estadoEquipo = request.data.get('estadoEquipo', instance.estadoEquipo)== 'true'
        instance.estadoUsoEquipo = request.data.get('estadoUsoEquipo', instance.estadoUsoEquipo)
        instance.vidaUtil = request.data.get('vidaUtil', instance.vidaUtil)
        instance.fechaAdquiscion = request.data.get('fechaAdquiscion', instance.fechaAdquiscion)

        # Manejo del campo almacen
        almacen_data = request.data.get('almacen')
        if isinstance(almacen_data, str):
            almacen_data = json.loads(almacen_data)

        # Asignar almacen_id de manera segura
        if isinstance(almacen_data, dict) and 'id' in almacen_data:
            instance.almacen_id = almacen_data['id']
        elif almacen_data:
            instance.almacen_id = almacen_data

        # Guardar la instancia actualizada
        instance.save()

        # Retornar la imagen antigua junto con los datos actualizados
        response_data = serializer.data
        response_data['old_image_url'] = old_image_url

        return Response(response_data, status=status.HTTP_200_OK)
    # Método para crear un equipo
    def create(self, request, *args, **kwargs):
        nombreEquipo = request.data.get('nombreEquipo')
        marca = request.data.get('marca')
        modelo = request.data.get('modelo')
        estadoUsoEquipo = request.data.get('estadoUsoEquipo')
        vidaUtil = request.data.get('vidaUtil')
        fechaAdquiscion = request.data.get('fechaAdquiscion')
        almacen_id = request.data.get('almacen')

        # Subir la imagen a S3 si se proporciona
        imagenEquipos_url = None
        if 'imagenEquipos' in request.FILES:
            file = request.FILES['imagenEquipos']
            imagenEquipos_url = self.upload_image_to_s4(file)

        # Crear el equipo
        equipo = Equipos.objects.create(
            nombreEquipo=nombreEquipo,
            marca=marca,
            modelo=modelo,
            estadoUsoEquipo=estadoUsoEquipo,
            vidaUtil=vidaUtil,
            fechaAdquiscion=fechaAdquiscion,
            almacen_id=almacen_id,
            imagenEquipos_url=imagenEquipos_url
        )

        return Response(EquiposSerializer(equipo).data, status=status.HTTP_201_CREATED)

    def upload_image_to_s4(self, file):
        s3_client = boto3.client('s3',
                                aws_access_key_id='AKIAXBZV5WHW7U4O2QEF',
                                aws_secret_access_key='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',
                                config=Config(signature_version='s3v4'))

        try:
            s3_key = f"imagenes/{file.name}"
            s3_client.upload_fileobj(file, 'localimg', s3_key, ExtraArgs={'ContentType': file.content_type})
            imagenEquipos_url = f"https://localimg.s3.us-east-2.amazonaws.com/{s3_key}"
            return imagenEquipos_url
        except Exception as e:
            raise Exception(f"Error subiendo imagen a S3: {str(e)}")
        
    
class MantenimientosViewSet(viewsets.ModelViewSet):
    queryset = Mantenimientos.objects.all()
    serializer_class = MantenimientosSerializer
    def update(self, request, pk=None):
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)

        instance.equipo_id = request.data.get('equipo', {}).get('id', instance.equipo_id)
        instance.save()
        return Response(serializer.data)

    def create(self, request, *args, **kwargs):
        fechaInicio = request.data.get('fechaInicio')
        fechaFin = request.data.get('fechaFin')
        estadoMantenimiento = request.data.get('estadoMantenimiento')
        tipoMantenimiento = request.data.get('tipoMantenimiento')
        detalleMantenimiento = request.data.get('detalleMantenimiento')
        responsable = request.data.get('responsable')
        equipo_id = request.data.get('equipo')

        try:
            equipo = Equipos.objects.get(id=equipo_id)
        except Equipos.DoesNotExist:
            return Response({'error': 'Equipo no encontrado'}, status=status.HTTP_404_NOT_FOUND)

        mantenimiento = Mantenimientos.objects.create(
            fechaInicio=fechaInicio,
            fechaFin=fechaFin,
            estadoMantenimiento=estadoMantenimiento,
            tipoMantenimiento=tipoMantenimiento,
            detalleMantenimiento=detalleMantenimiento,
            responsable=responsable,
            equipo=equipo
        )

        return Response(MantenimientosSerializer(mantenimiento).data, status=status.HTTP_201_CREATED)

class SolicitudesViewSet(viewsets.ModelViewSet):
    queryset = Solicitudes.objects.all()
    serializer_class = SolicitudesSerializer

    def update(self, request, pk=None):
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        instance.fechaSolicitud = request.data.get('fechaSolicitud', instance.fechaSolicitud)
        instance.fechaRetornoEstimada = request.data.get('fechaRetornoEstimada', instance.fechaRetornoEstimada)
        instance.fechaRetornoReal = request.data.get('fechaRetornoReal', instance.fechaRetornoReal)
        instance.equipo_id = request.data.get('equipo', {}).get('id', instance.equipo_id)
        instance.obra_id = request.data.get('obra', {}).get('id', instance.obra_id)
        instance.usuario_id = request.data.get('usuario', {}).get('id', instance.usuario_id)
        instance.save()
        return Response(serializer.data)

    def create(self, request, *args, **kwargs):
        fechaSolicitud = request.data.get('fechaSolicitud')
        fechaRetornoEstimada = request.data.get('fechaRetornoEstimada')
        fechaRetornoReal = request.data.get('fechaRetornoReal')
        equipo_id = request.data.get('equipo')
        obra_id = request.data.get('obra')
        usuario_id = request.data.get('usuario')

        try:
            equipo = Equipos.objects.get(id=equipo_id)
            obra = Obras.objects.get(id=obra_id)
            usuario = Usuarios.objects.get(id=usuario_id)
        except (Equipos.DoesNotExist, Obras.DoesNotExist, Usuarios.DoesNotExist):
            return Response({'error': 'Equipo, obra o usuario no encontrado'}, status=status.HTTP_404_NOT_FOUND)

        solicitud = Solicitudes.objects.create(
            fechaSolicitud=fechaSolicitud,
            fechaRetornoEstimada=fechaRetornoEstimada,
            fechaRetornoReal=fechaRetornoReal,
            equipo=equipo,
            obra=obra,
            usuario=usuario
        )

        return Response(SolicitudesSerializer(solicitud).data, status=status.HTTP_201_CREATED)