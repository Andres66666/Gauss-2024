import { authGuard } from './../auth.guard';
import { Mantenimiento } from './../MadreManteniminiento/models/mantenimiento';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { UsuarioComponent } from '../MadreUsuario/usuario/usuario.component';
import { RolComponent } from '../MadreRol/rol/rol.component';
import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { StorageService } from '../../services/storage.service';
import { WindowService } from '../../services/window.service';
import { RegistrarUsuarioComponent } from '../MadreUsuario/registrar-usuario/registrar-usuario.component';
import { EditarUsuarioComponent } from '../MadreUsuario/editar-usuario/editar-usuario.component';
import { RegistrarRolComponent } from '../MadreRol/registrar-rol/registrar-rol.component';
import { EditarRolComponent } from '../MadreRol/editar-rol/editar-rol.component';
import { RegistrarPermisoComponent } from '../MadrePermiso/registrar-permiso/registrar-permiso.component';
import { EditarPermisoComponent } from '../MadrePermiso/editar-permiso/editar-permiso.component';
import { PermisoComponent } from '../MadrePermiso/persmiso/permiso.component';
import { RegistrarRolpermisoComponent } from '../Madre-Rol-Permiso/registrar-rolpermiso/registrar-rolpermiso.component';
import { EditarRolpermisoComponent } from '../Madre-Rol-Permiso/editar-rolpermiso/editar-rolpermiso.component';
import { RolPermisoComponent } from '../Madre-Rol-Permiso/rol-permiso/rol-permiso.component';
import { RegistrarUsuariorolComponent } from '../Madre-Usuario-Rol/registrar-usuariorol/registrar-usuariorol.component';
import { UsuarioRolComponent } from '../Madre-Usuario-Rol/usuario-rol/usuario-rol.component';
import { EditarUsuariorolComponent } from '../Madre-Usuario-Rol/editar-usuariorol/editar-usuariorol.component';
import { RegistrarObraComponent } from '../MadreObra/registrar-obra/registrar-obra.component';
import { EditarObraComponent } from '../MadreObra/editar-obra/editar-obra.component';
import { ListarObraComponent } from '../MadreObra/listar-obra/listar-obra.component';
import { RegistrarAlmacenComponent } from '../MadreAlmacen/registrar-almacen/registrar-almacen.component';
import { EditarAlmacenComponent } from '../MadreAlmacen/editar-almacen/editar-almacen.component';
import { ListarAlmacenComponent } from '../MadreAlmacen/listar-almacen/listar-almacen.component';
import { RegistrarEquiposComponent } from '../MadreEquipo/registrar-equipos/registrar-equipos.component';
import { EditarEquiposComponent } from '../MadreEquipo/editar-equipos/editar-equipos.component';
import { ListarEquiposComponent } from '../MadreEquipo/listar-equipos/listar-equipos.component';
import { RegistrarMantenimientoComponent } from '../MadreManteniminiento/registrar-mantenimiento/registrar-mantenimiento.component';
import { ListarMantenimientoComponent } from '../MadreManteniminiento/listar-mantenimiento/listar-mantenimiento.component';
import { EditarMantenimientoComponent } from '../MadreManteniminiento/editar-mantenimiento/editar-mantenimiento.component';
import { RegistrarSolicitudesComponent } from '../MadreSolicitudes/registrar-solicitudes/registrar-solicitudes.component';
import { ListarSolicitudesComponent } from '../MadreSolicitudes/listar-solicitudes/listar-solicitudes.component';
import { EditarSolicitudesComponent } from '../MadreSolicitudes/editar-solicitudes/editar-solicitudes.component';
import { ListarEquiposOComponent } from '../MadreEquipo/listar-equipos-o/listar-equipos-o.component';
import { GeneracionReportesComponent } from '../Reportes/generacion-reportes/generacion-reportes.component';
import { AuthService } from '../../services/auth.service';
import { SolicituSolicitanteComponent } from "../MadreSolicitudes/solicitu-solicitante/solicitu-solicitante.component";

@Component({
  selector: 'app-index',
  standalone: true,
  imports: [
    CommonModule,
    HttpClientModule,
    UsuarioComponent,
    RolComponent,
    RegistrarUsuarioComponent,
    EditarUsuarioComponent,
    RegistrarRolComponent,
    RegistrarRolComponent,
    EditarRolComponent,
    RegistrarPermisoComponent,
    EditarPermisoComponent,
    PermisoComponent,
    RegistrarRolpermisoComponent,
    EditarRolpermisoComponent,
    RolPermisoComponent,
    RegistrarUsuariorolComponent,
    UsuarioRolComponent,
    EditarUsuariorolComponent,
    RegistrarObraComponent,
    EditarObraComponent,
    ListarObraComponent,
    RegistrarAlmacenComponent,
    EditarAlmacenComponent,
    ListarAlmacenComponent,
    RegistrarEquiposComponent,
    EditarEquiposComponent,
    ListarEquiposComponent,
    RegistrarMantenimientoComponent,
    ListarMantenimientoComponent,
    EditarMantenimientoComponent,
    RegistrarSolicitudesComponent,
    ListarSolicitudesComponent,
    EditarSolicitudesComponent,
    ListarEquiposOComponent,
    GeneracionReportesComponent,
    SolicituSolicitanteComponent
],
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css'], // Corrected 'styleUrl' to 'styleUrls'
})
export class IndexComponent implements OnInit {
  isSidebarOpen = true; // La barra lateral está inicialmente visible
  windowWidth: number;
  permisos: string[] = [];
  nombreUsuario: string = '';
  apellido: string | null = '';
  roles: string[] = []; // Nueva propiedad para almacenar los roles del usuario
  imagen_url: string | null = '';

  usuarioIdParaEditar: number | null = null; // Store the ID of the user to edit
  rolIdParaEditar: number | null = null;
  permisoIdParaEditar: number | null = null;
  rolpermisoIdParaEditar: number | null = null;
  usuariorolIdParaEditar: number | null = null;
  obraIdParaEditar: number | null = null;
  almacenIdParaEditar: number | null = null;
  equipoIdParaEditar: number | null = null;
  mantenimientoIdParaEditar: number | null = null;
  solicitudIdParaEditar: number | null = null;

  constructor(
    private storageService: StorageService,
    private authService: AuthService,
    private router: Router,
    private windowService: WindowService
  ) {
    if (typeof window !== 'undefined') {
      this.windowWidth = window.innerWidth;
    } else {
      this.windowWidth = 0; // o un valor por defecto
    }
  }

  // Detectar cambios en el tamaño de la ventana y ajustar la visibilidad
  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.windowWidth = window.innerWidth;
    this.isSidebarOpen = this.windowWidth >= 768; // Ocultar o mostrar barra lateral según el tamaño
  }

  ngOnInit(): void {
    this.windowService.windowWidth$.subscribe((width) => {
      this.windowWidth = width;
      this.isSidebarOpen = this.windowWidth >= 768;
    });
    try {
      if (typeof window !== 'undefined') {
        const usuario = JSON.parse(localStorage.getItem('usuario') || '{}');
        if (usuario && typeof usuario === 'object') {
          this.nombreUsuario = usuario.nombreUsuario || '';
          this.apellido = usuario.apellido || '';
          this.permisos = usuario.permisos || [];
          this.roles = usuario.roles || []; // Almacena los roles desde el localStorage
          this.imagen_url = usuario.imagen_url || '';
        } else {
          console.error('Usuario no válido en localStorage');
        }
      }
    } catch (error) {
      console.error('Error al recuperar el usuario de localStorage', error);
    }
  }

  puedeVer(permiso: string): boolean {
    return this.permisos.includes(permiso);
  }

  logout(): void {
    this.storageService.removeItem('token');
    localStorage.removeItem('roles');
    localStorage.removeItem('permisos');
    localStorage.removeItem('usuario'); // Eliminar la información del usuario
    this.router.navigate(['/login']); // Redirigir al login
  }
  onLogout() {
    this.authService.logout();
  }

  activeSection: string | null = null; // Variable para controlar la sección activa
  componenteActual: string = ''; // Valor inicial
  // Método para cambiar el componente actual basado en el ítem clickeado
  mostrarComponente(componente: string, id?: number): void {
    this.componenteActual = componente;

    if (
      (componente === 'EditarUsuario' && id != null) ||
      (componente === 'EditarRol' && id != null) ||
      (componente === 'EditarPermiso' && id != null) ||
      (componente === 'EditarRolPermiso' && id != null) ||
      (componente === 'EditarUsuarioRol' && id != null) ||
      (componente === 'EditarObra' && id != null) ||
      (componente === 'EditarAlmacen' && id != null) ||
      (componente === 'EditarEquipo' && id != null) ||
      (componente === 'EditarMantenimiento' && id != null) ||
      (componente === 'EditarSolicitudes' && id != null)
    ) {
      // Ensure id is not null
      this.usuarioIdParaEditar = id; // Store the ID of the user to edit
      this.rolIdParaEditar = id;
      this.permisoIdParaEditar = id;
      this.rolpermisoIdParaEditar = id;
      this.usuariorolIdParaEditar = id;
      this.obraIdParaEditar = id;
      this.almacenIdParaEditar = id;
      this.equipoIdParaEditar = id;
      this.mantenimientoIdParaEditar = id;
      this.solicitudIdParaEditar = id;
    }

    this.activeSection = null; // Resetea la sección activa después de seleccionar un componente
  }
  // Método para manejar el evento de registrar
  // Método para manejar el evento de registrar
  onRegistrarUsuario() {
    this.componenteActual = 'RegistrarUsuario'; // Cambia a la vista de registro
  }
  onRegistrarRol() {
    this.componenteActual = 'RegistrarRol';
  }
  onRegistrarPermiso() {
    this.componenteActual = 'RegistrarPermisos';
  }
  onRegistrarRolPermiso() {
    this.componenteActual = 'RegistrarRolPermisos';
  }
  onRegistrarUsuarioRoles() {
    this.componenteActual = 'RegistrarUsuarioRol';
  }
  onRegistrarObras() {
    this.componenteActual = 'RegistrarObra';
  }
  onRegistrarAlmacenes() {
    this.componenteActual = 'RegistrarAlmacen';
  }
  onRegistrarEquipos() {
    this.componenteActual = 'RegistrarEquipos';
  }
  onRegistrarMatenimientos() {
    this.componenteActual = 'RegistrarMantenimiento';
  }
  onRegistrarSolicitudes() {
    this.componenteActual = 'RegistrarSolicitudes';
  }
  // Método para alternar la visualización de las opciones
  toggleOptions(section: string): void {
    this.activeSection = this.activeSection === section ? null : section; // Alterna la sección activa
  }

  isSidebarVisible: boolean = true;
  iconClass: string = 'fas fa-bars'; // Ícono inicial

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
    this.isSidebarVisible = !this.isSidebarVisible;
    this.iconClass = this.isSidebarVisible ? 'fas fa-bars' : 'fas fa-times'; // Cambia el ícono
  }

  confirmarCerrarSesion() {
    const confirmar = window.confirm(
      '¿Está seguro de que desea cerrar sesión?'
    );
    if (confirmar) {
      this.logout(); // Llamar a la función de cierre de sesión si se confirma
    }
  }
}
