from urllib import request
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

from rest_framework_simplejwt.tokens import RefreshToken

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
                # Generación del token
                refresh = RefreshToken.for_user(usuario)
                #return Response({'token': usuario.token}, status=status.HTTP_200_OK)
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
                    'refresh': str(refresh),
                    'access': str(refresh.access_token),
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

class AlmacenGlobalViewSet(viewsets.ModelViewSet):
    queryset = Almacenes.objects.filter(almacen_global=True)
    serializer_class = AlmacenesSerializer

class PermisoViewSet(viewsets.ModelViewSet):
    queryset = Permisos.objects.all()
    serializer_class = PermisoSerializer

    def create(self, request, *args, **kwargs):
        # Verifica si el nombre del permiso ya existe
        nombre_permiso = request.data.get('nombre')
        if Permisos.objects.filter(nombre=nombre_permiso).exists():
            return Response(
                {'error': 'El nombre del permiso ya existe en la base de datos.'},
                status=status.HTTP_409_CONFLICT
            )
        # Si no existe, llama al método de creación de la clase base
        return super().create(request, *args, **kwargs)
    
    def update(self, request, *args, **kwargs):
        # Verifica si el nombre del permiso ya existe
        nombre_permiso = request.data.get('nombre')
        if Permisos.objects.filter(nombre=nombre_permiso).exists():
            return Response(
                {'error': 'El nombre del permiso ya existe en la base de datos.'},
                status=status.HTTP_409_CONFLICT
            )
        # Si no existe, llama al método de creación de la clase base
        return super().create(request, *args, **kwargs)

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
        instance.departamento = request.data.get('departamento', instance.departamento)

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
        obra_id = request.data.get('obra')
        ci = request.data.get('ci')
        departamento = request.data.get('departamento')

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
            departamento=departamento,  # Guardar el departamento
            obra_id=obra_id if obra_id else None,
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

    def create(self, request, *args, **kwargs):
        # Verifica si el nombre del rol ya existe
        nombre_rol = request.data.get('nombreRol')
        if Roles.objects.filter(nombreRol=nombre_rol).exists():
            return Response(
                {'error': 'El nombre del rol ya existe en la base de datos.'},
                status=status.HTTP_409_CONFLICT
            )
        # Si no existe, llama al método de creación de la clase base
        return super().create(request, *args, **kwargs)
    
    def update(self, request, *args, **kwargs):
        # Verifica si el nombre del rol ya existe
        nombre_rol = request.data.get('nombreRol')
        if Roles.objects.filter(nombreRol=nombre_rol).exists():
            return Response(
                {'error': 'El nombre del rol ya existe en la base de datos.'},
                status=status.HTTP_409_CONFLICT
            )
        # Si no existe, llama al método de creación de la clase base
        return super().create(request, *args, **kwargs)

class UsuarioRolViewSet(viewsets.ModelViewSet):
    queryset = UsuarioRoles.objects.all()
    serializer_class = UsuarioRolSerializer
    
    def update(self, request, pk=None):
        instance = self.get_object()

        # Obtener los IDs del usuario y rol desde los datos del request
        usuario_id = request.data.get('usuario', {}).get('id', instance.usuario_id)
        rol_id = request.data.get('rol', {}).get('id', instance.rol_id)

        # Validar si el usuario ya tiene asignado ese rol, excluyendo la instancia actual
        if UsuarioRoles.objects.filter(usuario_id=usuario_id, rol_id=rol_id).exclude(pk=instance.pk).exists():
            return Response({'error': ['El usuario ya tiene este rol asignado']}, status=status.HTTP_400_BAD_REQUEST)

        # Si pasa la validación, actualizar los datos de la instancia
        serializer = self.get_serializer(instance, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)

        self.perform_update(serializer)
        instance.usuario_id = usuario_id
        instance.rol_id = rol_id
        instance.save()

        return Response(serializer.data)

    def create(self, request, *args, **kwargs):
        usuario_id = request.data.get('usuario')
        rol_id = request.data.get('rol')

        # Validar si el usuario ya tiene asignado ese rol
        if UsuarioRoles.objects.filter(usuario_id=usuario_id, rol_id=rol_id).exists():
            # Devuelve un mensaje de error como lista para ser concatenado en el frontend
            return Response({'error': ['Error en la asignación, el usuario ya tiene este rol asignado']}, status=status.HTTP_400_BAD_REQUEST)

        # Crear la relación usuario-rol
        usuario_rol = UsuarioRoles.objects.create(usuario_id=usuario_id, rol_id=rol_id)
        return Response(UsuarioRolSerializer(usuario_rol).data, status=status.HTTP_201_CREATED)
    
class RolPermisoViewSet(viewsets.ModelViewSet):
    queryset = RolPermisos.objects.all()
    serializer_class = RolPermisoSerializer

    def update(self, request, pk=None):
        instance = self.get_object()  # Obtiene la instancia del objeto a actualizar
        rol_id = request.data.get('rol', {}).get('id', instance.rol_id)
        permiso_id = request.data.get('permiso', {}).get('id', instance.permiso_id)

        # Verificar si el permiso ya está asignado al rol
        if RolPermisos.objects.filter(rol_id=rol_id, permiso_id=permiso_id).exists():
            return Response({'error': ['El rol ya tiene el permiso asignado.']}, status=status.HTTP_400_BAD_REQUEST)

        # Serializa los datos entrantes, permitiendo la actualización parcial
        serializer = self.get_serializer(instance, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)  # Valida los datos

        # Actualiza los campos solo si la validación es exitosa
        instance.rol_id = rol_id
        instance.permiso_id = permiso_id
        instance.save()  # Guarda la instancia actualizada

        return Response(serializer.data)  # Devuelve la respuesta con los datos actualizados
    
    def create(self, request, *args, **kwargs):
        rol_id = request.data.get('rol')
        permisos = request.data.get('permisos', [])  # Obtener el array de permisos
        mensajes_error = []

        if not rol_id or not permisos:
            return Response({'error': 'Faltan datos de rol o permisos'}, status=status.HTTP_400_BAD_REQUEST)


        # Verificar si el rol ya tiene permisos duplicados
        for permiso_id in permisos:
            if RolPermisos.objects.filter(rol_id=rol_id, permiso_id=permiso_id).exists():
                # Obtener el nombre del permiso
                permiso = Permisos.objects.get(id=permiso_id)
                mensajes_error.append(f"El rol ya tiene el permiso: {permiso.nombre}")

        # Si hay mensajes de error, devolver la respuesta con los mensajes
        if mensajes_error:
            return Response({'error': mensajes_error}, status=status.HTTP_400_BAD_REQUEST)

        # Crear una entrada de RolPermiso por cada permiso
        for permiso_id in permisos:
            RolPermisos.objects.create(rol_id=rol_id, permiso_id=permiso_id)

        # Enviar una respuesta indicando que la creación fue exitosa
        return Response({'message': 'RolPermisos creados correctamente'}, status=status.HTTP_201_CREATED)

class ObrasViewSet(viewsets.ModelViewSet):
    queryset = Obras.objects.all()
    serializer_class = ObrasSerializer

    def update(self, request, *args, **kwargs):
            partial = kwargs.pop('partial', False)  # Permitir actualizaciones parciales
            instance = self.get_object()
            serializer = self.get_serializer(instance, data=request.data, partial=partial)

            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            else:
                print("Errores de validación:", serializer.errors)  # Imprimir errores
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    def close_obra(self, request, pk=None):
            """
            Cierra una obra y devuelve los equipos al almacén global.
            """
            obra = self.get_object()
            obra.estadoObra = False  # Cambiar el estado de la obra a cerrada
            obra.save()

            # Obtener el almacén global
            almacen_global = Almacenes.objects.filter(almacen_global=True).first()
            if almacen_global:
                equipos = Equipos.objects.filter(almacen__obra=obra)
                for equipo in equipos:
                    # Registrar el traspaso de vuelta al almacén global
                    HistorialTraspasosEquipos.objects.create(
                        equipo=equipo,
                        obra=obra,
                        almacen_origen=equipo.almacen,
                        almacen_destino=almacen_global,
                    )
                    # Actualizar el equipo para que apunte al almacén global
                    equipo.almacen = almacen_global
                    equipo.save()

            return Response({'status': 'obra cerrada y equipos devueltos al almacén global'}, status=status.HTTP_200_OK)
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
    def get_queryset(self):
        obra_id = self.request.query_params.get('obra', None)
        if obra_id is not None:
            return self.queryset.filter(obra__id=obra_id)
        return self.queryset
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
        # Crear un equipo en el almacén global
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        equipo = serializer.save()

        # Registrar el traspaso al almacén global
        almacen_global = Almacenes.objects.filter(almacen_global=True).first()
        if almacen_global:
            HistorialTraspasosEquipos.objects.create(
                equipo=equipo,
                obra=None,  # No asignado a ninguna obra aún
                almacen_origen=almacen_global,
                almacen_destino=almacen_global,
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
    def assign_to_obra(self, request, pk=None):
            """
            Asigna un equipo a una obra y registra el traspaso.
            """
            equipo = self.get_object()
            obra_id = request.data.get('obra_id')
            obra = Obras.objects.get(id=obra_id)
            nuevo_almacen = Almacenes.objects.filter(obra=obra).first()

            if nuevo_almacen:
                # Registrar el traspaso
                HistorialTraspasosEquipos.objects.create(
                    equipo=equipo,
                    obra=obra,
                    almacen_origen=equipo.almacen,
                    almacen_destino=nuevo_almacen,
                )
                # Actualizar el equipo para que apunte al nuevo almacén
                equipo.almacen = nuevo_almacen
                equipo.save()

                return Response({'status': 'equipo asignado a la obra'}, status=status.HTTP_200_OK)
            return Response({'error': 'Almacén no encontrado para la obra'}, status=status.HTTP_404_NOT_FOUND)

        
        
class MantenimientosViewSet(viewsets.ModelViewSet):
    queryset = Mantenimientos.objects.all()
    serializer_class = MantenimientosSerializer

    def create(self, request, *args, **kwargs):
        equipo_id = request.data.get('equipo')

        # Verificar si el equipo ya está en mantenimiento
        if Mantenimientos.objects.filter(equipo_id=equipo_id, estadoMantenimiento=True).exists():
            return Response({'error': 'El equipo ya está en mantenimiento.'}, status=status.HTTP_400_BAD_REQUEST)

        # Crear el mantenimiento
        try:
            equipo = Equipos.objects.get(id=equipo_id)
        except Equipos.DoesNotExist:
            return Response({'error': 'Equipo no encontrado'}, status=status.HTTP_404_NOT_FOUND)

        mantenimiento = Mantenimientos.objects.create(
            fechaInicio=request.data.get('fechaInicio'),
            fechaFin=request.data.get('fechaFin'),
            estadoMantenimiento=True,  # En proceso
            tipoMantenimiento=request.data.get('tipoMantenimiento'),
            detalleMantenimiento=request.data.get('detalleMantenimiento'),
            responsable=request.data.get('responsable'),
            equipo=equipo
        )

        # Cambiar el estado del equipo a "En mantenimiento"
        equipo.estadoUsoEquipo = 'En mantenimiento'
        equipo.save()

        return Response(MantenimientosSerializer(mantenimiento).data, status=status.HTTP_201_CREATED)

    def update(self, request, pk=None):
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)

        instance.equipo_id = request.data.get('equipo', {}).get('id', instance.equipo_id)
        instance.save()
        return Response(serializer.data)

        return Response(serializer.data)



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
        #fechaRetornoReal = request.data.get('fechaRetornoReal')
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
            #fechaRetornoReal=fechaRetornoReal,
            equipo=equipo,
            obra=obra,
            usuario=usuario
        )

        return Response(SolicitudesSerializer(solicitud).data, status=status.HTTP_201_CREATED)
    
