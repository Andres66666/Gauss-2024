from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    UsuarioViewSet,
    RolViewSet,
    PermisoViewSet,
    UsuarioRolViewSet,
    RolPermisoViewSet,
    ObrasViewSet,
    AlmacenesViewSet,
    EquiposViewSet,
    MantenimientosViewSet,
    SolicitudesViewSet,
    LoginView,
    AlmacenGlobalViewSet,
)
from . import views

# Create a router and register viewsets
router = DefaultRouter()
router.register(r'usuario',  UsuarioViewSet)
router.register(r'rol',  RolViewSet)
router.register(r'permiso',  PermisoViewSet)
router.register(r'usuario-rol',  UsuarioRolViewSet)
router.register(r'rol-permiso',  RolPermisoViewSet)
router.register(r'obra',  ObrasViewSet)
router.register(r'almacen',  AlmacenesViewSet)
router.register(r'equipo',  EquiposViewSet)
router.register(r'mantenimiento',  MantenimientosViewSet)
router.register(r'solicitud',  SolicitudesViewSet)
router.register(r'almacen-global', AlmacenGlobalViewSet, basename='almacen-global')  # Ruta para el almacén global

urlpatterns = [
    path('', include(router.urls)),
    path('login/', LoginView.as_view(), name='login'),
]