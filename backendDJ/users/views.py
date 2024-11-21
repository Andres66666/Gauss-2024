import datetime
from urllib import request
from rest_framework import viewsets
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.hashers import check_password
from rest_framework.decorators import action

from .serializers import (
    AlmacenesSerializer,
    EquiposSerializer,
    MantenimientosSerializer,
    ObrasSerializer,
    RolPermisoSerializer,
    LoginSerializer,
    UsoSolicitudesEquiposSerializer,
    UsuarioSerializer,
    RolSerializer,
    PermisoSerializer,
    UsuarioRolSerializer,
)
from .models import Obras, Almacenes, Equipos, Mantenimientos, UsoSolicitudesEquipos, Usuarios, Roles, Permisos, UsuarioRoles, RolPermisos
import boto3
from botocore.config import Config
import json

from rest_framework_simplejwt.tokens import RefreshToken

class LoginView(APIView):
    authentication_classes = []  # Elimina autenticación solo para login
    permission_classes = []      # Deja vacía la lista de permisos

    def post(self, request):
        # Validación del formulario de login
        serializer = LoginSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        # Obtención de los datos validados
        correo = serializer.validated_data.get('correo')
        password = serializer.validated_data.get('password')

        try:
            # Verificación de estado del usuario
            usuario = Usuarios.objects.get(correo=correo)

            # Verificar si el usuario está activo
            if not usuario.activo:
                return Response({'error': 'No puedes iniciar sesión!!!. Comuníquese con el administrador. Gracias.'}, status=status.HTTP_403_FORBIDDEN)
            
            # Obtener todos los roles asociados con el usuario
            usuario_roles = UsuarioRoles.objects.filter(usuario=usuario)
            if not usuario_roles:
                return Response({'error': 'El usuario no tiene roles asignados.'}, status=status.HTTP_403_FORBIDDEN)

            # Verificar si todos los roles están desactivados
            active_roles = [usuario_rol.rol for usuario_rol in usuario_roles if usuario_rol.rol.activo]
            if not active_roles:
                return Response({'error': 'El rol asignado al usuario está desactivado. No puedes iniciar sesión.'}, status=status.HTTP_403_FORBIDDEN)

            # Verificar la contraseña
            if check_password(password, usuario.password):
                # Generación del token JWT
                refresh = RefreshToken.for_user(usuario)
                access_token = str(refresh.access_token)

                # Obtener nombres de roles activos del usuario
                roles = [rol.nombreRol for rol in active_roles]

                # Obtener permisos asociados a los roles del usuario
                permisos = RolPermisos.objects.filter(rol__in=[usuario_rol.rol for usuario_rol in usuario_roles])
                permisos_nombres = [permiso.permiso.nombre for permiso in permisos]

                # Serializar los datos del usuario
                usuario_serializer = UsuarioSerializer(usuario)
                return Response({
                    'mensaje': 'Login exitoso',
                    'refresh': str(refresh),
                    'access_token': access_token,
                    'access': str(refresh.access_token),
                    'usuario': usuario_serializer.data,
                    'nombreUsuario': usuario.nombreUsuario,
                    'apellido': usuario.apellido,
                    'imagen_url': usuario.imagen_url,
                    'roles': roles,
                    'permisos': permisos_nombres,
                    'usuario_id': usuario.id
                }, status=status.HTTP_200_OK)
            else:
                # Respuesta en caso de credenciales incorrectas
                return Response({'error': 'Credenciales incorrectas'}, status=status.HTTP_400_BAD_REQUEST)

        except Usuarios.DoesNotExist:
            # Respuesta en caso de que el usuario no exista
            return Response({'error': 'Usuario no encontrado'}, status=status.HTTP_400_BAD_REQUEST)

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
        # Obtener el permiso que se está actualizando
        permiso = self.get_object()
        
        # Verifica si el nombre del permiso está siendo cambiado
        nombre_permiso = request.data.get('nombre')
        if nombre_permiso and Permisos.objects.filter(nombre=nombre_permiso).exclude(id=permiso.id).exists():
            return Response(
                {'error': 'El nombre del permiso ya existe en la base de datos.'},
                status=status.HTTP_409_CONFLICT
            )
        
        # Si no hay conflictos, llama al método de actualización de la clase base
        return super().update(request, *args, **kwargs)


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


    def create(self, request, *args, **kwargs):
        nombreAlmacen = request.data.get('nombreAlmacen')
        obra_id = request.data.get('obra')

        # Validar que se proporcionen los campos requeridos
        if not nombreAlmacen or not obra_id:
            return Response(
                {"error": "nombreAlmacen y obra son campos requeridos."},
                status=status.HTTP_400_BAD_REQUEST
            )
        # Crear el nuevo almacén
        almacen = Almacenes.objects.create(
            nombreAlmacen=nombreAlmacen,
            obra_id=obra_id
        )
        return Response(AlmacenesSerializer(almacen).data, status=status.HTTP_201_CREATED)
    def update(self, request, pk=None):
        instance = self.get_object()  # Obtener el almacén actual por su ID (pk)
        serializer = self.get_serializer(instance, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)  # Validar datos

        # Actualizar campos específicos
        instance.nombreAlmacen = serializer.validated_data.get('nombreAlmacen', instance.nombreAlmacen)
        obra_id = serializer.validated_data.get('obra', {}).get('id')
        if obra_id is not None:
            instance.obra_id = obra_id

        # Actualizar el estado del almacén
        estado_almacen = serializer.validated_data.get('estadoAlmacen')
        if estado_almacen is not None:
            instance.estadoAlmacen = estado_almacen

        # Guardar cambios
        instance.save()
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def by_obra(self, request):
            obra_id = request.query_params.get('obra')
            if obra_id:
                almacenes = Almacenes.objects.filter(obra_id=obra_id)
                serializer = self.get_serializer(almacenes, many=True)
                return Response(serializer.data)
            return Response({"error": "Obra ID no proporcionada"}, status=400)


class EquiposViewSet(viewsets.ModelViewSet):
    queryset = Equipos.objects.all()
    serializer_class = EquiposSerializer

    def create(self, request, *args, **kwargs):
        # Obtener los datos del equipo desde la solicitud
        codigoEquipo = request.data.get('codigoEquipo')
        nombreEquipo = request.data.get('nombreEquipo')
        marcaEquipo = request.data.get('marcaEquipo')
        modeloEquipo = request.data.get('modeloEquipo')
        vidaUtilEquipo = request.data.get('vidaUtilEquipo')
        fechaAdquiscion = request.data.get('fechaAdquiscion')
        fechaFabricacion = request.data.get('fechaFabricacion')
        almacen_id = request.data.get('almacen')  # Campo almacen_id de la solicitud
        imagenEquipos_url = None

        # Subir la imagen a S3 si se proporciona
        if 'imagenEquipos_url' in request.FILES:
            file = request.FILES['imagenEquipos_url']
            imagenEquipos_url = self.upload_image_to_s3(file)

        # Verificar que almacen_id no sea nulo
        if not almacen_id:
            return Response({'error': 'El campo almacen es obligatorio.'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            # Crear el equipo
            equipo = Equipos.objects.create(
                codigoEquipo=codigoEquipo,
                nombreEquipo=nombreEquipo,
                marcaEquipo=marcaEquipo,
                modeloEquipo=modeloEquipo,
                vidaUtilEquipo=vidaUtilEquipo,
                fechaAdquiscion=fechaAdquiscion,
                fechaFabricacion=fechaFabricacion,
                imagenEquipos_url=imagenEquipos_url,
                almacen_id=almacen_id,  # Asignar el almacen
            )
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

        return Response(EquiposSerializer(equipo).data, status=status.HTTP_201_CREATED)

    
    def update(self, request, *args, **kwargs):
        # Obtener la instancia del equipo a actualizar
        equipo = self.get_object()

        # Obtener la URL de la imagen antigua
        old_image_url = equipo.imagenEquipos_url

        # Usar el serializador para validar los datos entrantes
        serializer = self.get_serializer(equipo, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)

        # Actualizar la imagen si se proporciona una nueva
        if 'imagenEquipos_url' in request.FILES:
            file = request.FILES['imagenEquipos_url']
            s3_url = self.upload_image_to_s3(file)
            equipo.imagenEquipos_url = s3_url  # Guardar la nueva URL de la imagen en la base de datos

        # Actualizar los campos restantes, usando los valores actuales si no se proporcionan nuevos
        equipo.codigoEquipo = request.data.get('codigoEquipo', equipo.codigoEquipo)
        equipo.nombreEquipo = request.data.get('nombreEquipo', equipo.nombreEquipo)
        equipo.marcaEquipo = request.data.get('marcaEquipo', equipo.marcaEquipo)
        equipo.modeloEquipo = request.data.get('modeloEquipo', equipo.modeloEquipo)

        # Asegurarse de que el valor de estadoEquipo sea un booleano
        estado_equipo = request.data.get('estadoEquipo', equipo.estadoEquipo)
        if isinstance(estado_equipo, str):
            equipo.estadoEquipo = estado_equipo.lower() == 'true'  # Convertir "true"/"false" a booleano
        else:
            equipo.estadoEquipo = estado_equipo

        # Actualizar estadoDisponibilidad asegurándose de que sea uno de los valores válidos
        estadoDisponibilidad = request.data.get('estadoDisponibilidad', equipo.estadoDisponibilidad)
        if estadoDisponibilidad in ['disponible', 'En uso', 'En mantenimiento']:
            equipo.estadoDisponibilidad = estadoDisponibilidad
        else:
            return Response({'error': 'Estado de disponibilidad no válido.'}, status=status.HTTP_400_BAD_REQUEST)

        equipo.vidaUtilEquipo = request.data.get('vidaUtilEquipo', equipo.vidaUtilEquipo)
        equipo.fechaAdquiscion = request.data.get('fechaAdquiscion', equipo.fechaAdquiscion)
        equipo.fechaFabricacion = request.data.get('fechaFabricacion', equipo.fechaFabricacion)
        equipo.horasUso = request.data.get('horasUso', equipo.horasUso)
        equipo.edadEquipo = request.data.get('edadEquipo', equipo.edadEquipo)

        # Manejo del campo almacen
        almacen_data = request.data.get('almacen')
        if almacen_data:
            equipo.almacen_id = almacen_data  # Asignar el nuevo almacen si se proporciona

        # Guardar la instancia actualizada
        equipo.save()

        # Retornar la imagen antigua junto con los datos actualizados
        response_data = serializer.data
        response_data['old_image_url'] = old_image_url

        return Response(response_data, status=status.HTTP_200_OK)
    
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




class MantenimientosViewSet(viewsets.ModelViewSet):
    queryset = Mantenimientos.objects.all()
    serializer_class = MantenimientosSerializer

    def create(self, request, *args, **kwargs):
        equipo_id = request.data.get('equipo')

        # Crear el mantenimiento
        try:
            equipo = Equipos.objects.get(id=equipo_id)
        except Equipos.DoesNotExist:
            return Response({'error': 'Equipo no encontrado'}, status=status.HTTP_404_NOT_FOUND)

        mantenimiento = Mantenimientos.objects.create(
            fechaInicio=request.data.get('fechaInicio'),
            fechaFin=request.data.get('fechaFin'),
            detalleMantenimiento=request.data.get('detalleMantenimiento'),
            responsable=request.data.get('responsable'),
            tipo_mantenimiento=request.data.get('tipo_mantenimiento'),
            equipo=equipo
        )

        # Incrementar el contador de mantenimientos
        if mantenimiento.tipo_mantenimiento == 'preventivo':
            equipo.cantMantPreventivos += 1
        elif mantenimiento.tipo_mantenimiento == 'correctivo':
            equipo.cantMantCorrectivos += 1
        equipo.save()

        return Response(MantenimientosSerializer(mantenimiento).data, status=status.HTTP_201_CREATED)

    def update(self, request, *args, **kwargs):
        mantenimiento = self.get_object()
        equipo = mantenimiento.equipo

        # Guardar el tipo de mantenimiento anterior
        old_tipo_mantenimiento = mantenimiento.tipo_mantenimiento

        # Actualizar los campos del mantenimiento
        serializer = self.get_serializer(mantenimiento, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()

        # Verificar si el tipo de mantenimiento ha cambiado
        new_tipo_mantenimiento = request.data.get('tipo_mantenimiento', old_tipo_mantenimiento)

        if new_tipo_mantenimiento != old_tipo_mantenimiento:
            # Decrementar el contador del tipo anterior
            if old_tipo_mantenimiento == 'preventivo':
                equipo.cantMantPreventivos -= 1
            elif old_tipo_mantenimiento == 'correctivo':
                equipo.cantMantCorrectivos -= 1

            # Incrementar el contador del nuevo tipo
            if new_tipo_mantenimiento == 'preventivo':
                equipo.cantMantPreventivos += 1
            elif new_tipo_mantenimiento == 'correctivo':
                equipo.cantMantCorrectivos += 1

        equipo.save()

        return Response(serializer.data, status=status.HTTP_200_OK)


from django.shortcuts import get_object_or_404
from rest_framework import viewsets
from django.utils import timezone  # Asegúrate de tener esta línea
from .models import UsoSolicitudesEquipos
from .serializers import UsoSolicitudesEquiposSerializer

class SolicitudesViewSet(viewsets.ModelViewSet):
    queryset = UsoSolicitudesEquipos.objects.all()
    serializer_class = UsoSolicitudesEquiposSerializer 

    def create(self, request, *args, **kwargs):
        # Obtener el ID del equipo y del usuario desde la solicitud
        equipo_id = request.data.get('equipo')
        usuario_id = request.data.get('usuario')

        # Verificar si el equipo existe
        try:
            equipo = Equipos.objects.get(id=equipo_id)
        except Equipos.DoesNotExist:
            return Response({'error': 'Equipo no encontrado'}, status=status.HTTP_404_NOT_FOUND)

        # Verificar si el usuario existe
        try:
            usuario = Usuarios.objects.get(id=usuario_id)
        except Usuarios.DoesNotExist:
            return Response({'error': 'Usuario no encontrado'}, status=status.HTTP_404_NOT_FOUND)

        # Verificar si el equipo está disponible
        if equipo.estadoDisponibilidad != 'disponible':
            return Response({'error': 'Equipo no disponible para registrar la solicitud.'}, status=status.HTTP_400_BAD_REQUEST)

        # Crear la solicitud
        solicitud = UsoSolicitudesEquipos(
            codigoSolicitud=request.data.get('codigoSolicitud'),
            fecha_solicitud=request.data.get('fecha_solicitud'),
            fecha_retorno_estimada=request.data.get('fecha_retorno_estimada'),
            fecha_retorno_real=request.data.get('fecha_retorno_real'),
            estado=request.data.get('estado', 'pendiente'),  # Valor por defecto
            motivo_uso=request.data.get('motivo_uso'),
            fecha_uso=request.data.get('fecha_uso'),
            equipo=equipo,
            usuario=usuario,
            descripcion_falla=request.data.get('descripcion_falla'),
            cantidad_fallas_solicitud=request.data.get('cantidad_fallas_solicitud', 0),
            horas_uso_solicitud=request.data.get('horas_uso_solicitud', 0)
        )

        # Guardar la solicitud
        solicitud.save()

         # Actualizar el estado de disponibilidad del equipo a "en uso"
        equipo.estadoDisponibilidad = 'En uso'
        equipo.save()
        

        return Response(UsoSolicitudesEquiposSerializer(solicitud).data, status=status.HTTP_201_CREATED)
    def update(self, request, *args, **kwargs):
        instance = self.get_object()

        # Obtener el ID del equipo y del usuario desde la solicitud
        equipo_id = request.data.get('equipo')
        usuario_id = request.data.get('usuario')

        # Verificar si el equipo existe
        if equipo_id:
            if isinstance(equipo_id, dict):
                equipo_id = equipo_id.get('id')
            try:
                equipo = Equipos.objects.get(id=equipo_id)
                instance.equipo = equipo
            except Equipos.DoesNotExist:
                return Response({'error': 'Equipo no encontrado'}, status=status.HTTP_404_NOT_FOUND)

        # Verificar si el usuario existe
        if usuario_id:
            if isinstance(usuario_id, dict):
                usuario_id = usuario_id.get('id')
            try:
                usuario = Usuarios.objects.get(id=usuario_id)
                instance.usuario = usuario
            except Usuarios.DoesNotExist:
                return Response({'error': 'Usuario no encontrado'}, status=status.HTTP_404_NOT_FOUND)

        # Actualizar los campos de la solicitud
        instance.codigoSolicitud = request.data.get('codigoSolicitud', instance.codigoSolicitud)
        instance.fecha_solicitud = request.data.get('fecha_solicitud', instance.fecha_solicitud)
        instance.fecha_retorno_estimada = request.data.get('fecha_retorno_estimada', instance.fecha_retorno_estimada)

        # Manejo de la fecha de retorno real
        fecha_retorno_real = request.data.get('fecha_retorno_real')
        if fecha_retorno_real:
            try:
                instance.fecha_retorno_real = timezone.datetime.strptime(fecha_retorno_real, '%Y-%m-%d').date()
            except ValueError:
                return Response({'error': 'Formato de fecha no válido para fecha_retorno_real. Debe ser YYYY-MM-DD.'}, status=status.HTTP_400_BAD_REQUEST)

        # Actualizar otros campos
        instance.estado = request.data.get('estado', instance.estado)
        instance.motivo_uso = request.data.get('motivo_uso', instance.motivo_uso)
        instance.fecha_uso = request.data.get('fecha_uso', instance.fecha_uso)
        instance.descripcion_falla = request.data.get('descripcion_falla', instance.descripcion_falla)
        instance.cantidad_fallas_solicitud = request.data.get('cantidad_fallas_solicitud', instance.cantidad_fallas_solicitud)
        instance.horas_uso_solicitud = request.data.get('horas_uso_solicitud', instance.horas_uso_solicitud)

        # Guardar los cambios
        try:
            instance.save()
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

        # Actualizar el equipo correspondiente
        equipo = instance.equipo
        equipo.numFallasReportdas += instance.cantidad_fallas_solicitud
        equipo.horasUso += instance.horas_uso_solicitud
        equipo.estadoDisponibilidad = 'disponible'  # Cambiar estado a disponible
        equipo.save()

        # Cambiar 'solicitud' por 'instance'
        return Response(UsoSolicitudesEquiposSerializer(instance).data, status=status.HTTP_200_OK)