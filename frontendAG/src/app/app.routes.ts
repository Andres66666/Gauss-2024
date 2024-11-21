import { Routes } from '@angular/router';
import { IndexComponent } from './components/index/index.component';
import { LoginComponent } from './components/login/login.component';

import { RolComponent } from './components/MadreRol/rol/rol.component';
import { RolPermisoComponent } from './components/Madre-Rol-Permiso/rol-permiso/rol-permiso.component';
import { UsuarioComponent } from './components/MadreUsuario/usuario/usuario.component';
import { PermisoComponent } from './components/MadrePermiso/persmiso/permiso.component';
import { UsuarioRolComponent } from './components/Madre-Usuario-Rol/usuario-rol/usuario-rol.component';
import { RegistrarUsuarioComponent } from './components/MadreUsuario/registrar-usuario/registrar-usuario.component';
import { EditarUsuarioComponent } from './components/MadreUsuario/editar-usuario/editar-usuario.component';
import { RegistrarRolComponent } from './components/MadreRol/registrar-rol/registrar-rol.component';
import { EditarRolComponent } from './components/MadreRol/editar-rol/editar-rol.component';
import { RegistrarPermisoComponent } from './components/MadrePermiso/registrar-permiso/registrar-permiso.component';
import { EditarPermisoComponent } from './components/MadrePermiso/editar-permiso/editar-permiso.component';
import { RegistrarRolpermisoComponent } from './components/Madre-Rol-Permiso/registrar-rolpermiso/registrar-rolpermiso.component';
import { EditarRolpermisoComponent } from './components/Madre-Rol-Permiso/editar-rolpermiso/editar-rolpermiso.component';
import { RegistrarUsuariorolComponent } from './components/Madre-Usuario-Rol/registrar-usuariorol/registrar-usuariorol.component';
import { EditarUsuariorolComponent } from './components/Madre-Usuario-Rol/editar-usuariorol/editar-usuariorol.component';
import { EditarObraComponent } from './components/MadreObra/editar-obra/editar-obra.component';
import { ListarObraComponent } from './components/MadreObra/listar-obra/listar-obra.component';
import { RegistrarObraComponent } from './components/MadreObra/registrar-obra/registrar-obra.component';
import { RegistrarAlmacenComponent } from './components/MadreAlmacen/registrar-almacen/registrar-almacen.component';
import { EditarAlmacenComponent } from './components/MadreAlmacen/editar-almacen/editar-almacen.component';
import { ListarAlmacenComponent } from './components/MadreAlmacen/listar-almacen/listar-almacen.component';
import { RegistrarEquiposComponent } from './components/MadreEquipo/registrar-equipos/registrar-equipos.component';
import { EditarEquiposComponent } from './components/MadreEquipo/editar-equipos/editar-equipos.component';
import { ListarEquiposComponent } from './components/MadreEquipo/listar-equipos/listar-equipos.component';
import { RegistrarMantenimientoComponent } from './components/MadreManteniminiento/registrar-mantenimiento/registrar-mantenimiento.component';
import { EditarMantenimientoComponent } from './components/MadreManteniminiento/editar-mantenimiento/editar-mantenimiento.component';
import { ListarMantenimientoComponent } from './components/MadreManteniminiento/listar-mantenimiento/listar-mantenimiento.component';
import { RegistrarSolicitudesComponent } from './components/MadreSolicitudes/registrar-solicitudes/registrar-solicitudes.component';
import { EditarSolicitudesComponent } from './components/MadreSolicitudes/editar-solicitudes/editar-solicitudes.component';
import { ListarSolicitudesComponent } from './components/MadreSolicitudes/listar-solicitudes/listar-solicitudes.component';
import { ListarEquiposOComponent } from './components/MadreEquipo/listar-equipos-o/listar-equipos-o.component';
import { GeneracionReportesComponent } from './components/Reportes/generacion-reportes/generacion-reportes.component';
import { GeneracionReportesUsuariosComponent } from './components/Reportes/generacion-reportes-usuarios/generacion-reportes-usuarios.component';
import { GeneracionReportesEquiposComponent } from './components/Reportes/generacion-reportes-equipos/generacion-reportes-equipos.component';
import { GeneracionReportesMantenimientosComponent } from './components/Reportes/generacion-reportes-mantenimientos/generacion-reportes-mantenimientos.component';
import { GeneracionReportesObrasComponent } from './components/Reportes/generacion-reportes-obras/generacion-reportes-obras.component';
import { authGuard } from './components/auth.guard';
import { SolicituSolicitanteComponent } from './components/MadreSolicitudes/solicitu-solicitante/solicitu-solicitante.component';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'index', component: IndexComponent, canActivate: [authGuard] },
  { path: 'usuario', component: UsuarioComponent, canActivate: [authGuard] },
  { path: 'rol', component: RolComponent, canActivate: [authGuard] },
  { path: 'permiso', component: PermisoComponent, canActivate: [authGuard] },
  {
    path: 'usuario-rol',
    component: UsuarioRolComponent,
    canActivate: [authGuard],
  },
  {
    path: 'rol-permiso',
    component: RolPermisoComponent,
    canActivate: [authGuard],
  },
  {
    path: 'registrar-usuario',
    component: RegistrarUsuarioComponent,
    canActivate: [authGuard],
  },
  {
    path: 'editar-usuario/:id',
    component: EditarUsuarioComponent,
    canActivate: [authGuard],
  },
  {
    path: 'registrar-rol',
    component: RegistrarRolComponent,
    canActivate: [authGuard],
  },
  {
    path: 'editar-rol',
    component: EditarRolComponent,
    canActivate: [authGuard],
  },
  {
    path: 'registrar-permiso',
    component: RegistrarPermisoComponent,
    canActivate: [authGuard],
  },
  {
    path: 'editar-permiso',
    component: EditarPermisoComponent,
    canActivate: [authGuard],
  },
  {
    path: 'registrar-rolpermiso',
    component: RegistrarRolpermisoComponent,
    canActivate: [authGuard],
  },
  {
    path: 'editar-rolpermiso/:id',
    component: EditarRolpermisoComponent,
    canActivate: [authGuard],
  },
  {
    path: 'registrar-usuariorol',
    component: RegistrarUsuariorolComponent,
    canActivate: [authGuard],
  },
  {
    path: 'editar-usuariorol/:id',
    component: EditarUsuariorolComponent,
    canActivate: [authGuard],
  },
  {
    path: 'registrar-obra',
    component: RegistrarObraComponent,
    canActivate: [authGuard],
  },
  {
    path: 'editar-obra/:id',
    component: EditarObraComponent,
    canActivate: [authGuard],
  },
  {
    path: 'listar-obra',
    component: ListarObraComponent,
    canActivate: [authGuard],
  },
  {
    path: 'registrar-almacen',
    component: RegistrarAlmacenComponent,
    canActivate: [authGuard],
  },
  {
    path: 'editar-almacen/:id',
    component: EditarAlmacenComponent,
    canActivate: [authGuard],
  },
  {
    path: 'listar-almacen',
    component: ListarAlmacenComponent,
    canActivate: [authGuard],
  },
  {
    path: 'registrar-equipo',
    component: RegistrarEquiposComponent,
    canActivate: [authGuard],
  },
  {
    path: 'editar-equipo/:id',
    component: EditarEquiposComponent,
    canActivate: [authGuard],
  },
  {
    path: 'listar-equipo',
    component: ListarEquiposComponent,
    canActivate: [authGuard],
  },
  {
    path: 'registrar-mantenimiento',
    component: RegistrarMantenimientoComponent,
    canActivate: [authGuard],
  },
  {
    path: 'editar-mantenimiento/:id',
    component: EditarMantenimientoComponent,
    canActivate: [authGuard],
  },
  {
    path: 'listar-mantenimiento',
    component: ListarMantenimientoComponent,
    canActivate: [authGuard],
  },
  {
    path: 'registrar-solicitud',
    component: RegistrarSolicitudesComponent,
    canActivate: [authGuard],
  },
  {
    path: 'editar-solicitud/:id',
    component: EditarSolicitudesComponent,
    canActivate: [authGuard],
  },
  {
    path: 'listar-solicitud',
    component: ListarSolicitudesComponent,
    canActivate: [authGuard],
  },
  {
    path: 'listar-equipo-O',
    component: ListarEquiposOComponent,
    canActivate: [authGuard],
  },
  {
    path: 'generacion-reportes',
    component: GeneracionReportesComponent,
    canActivate: [authGuard],
  },
  {
    path: 'generacion-reportes-usuarios',
    component: GeneracionReportesUsuariosComponent,
    canActivate: [authGuard],
  },
  {
    path: 'generacion-reportes-equipos',
    component: GeneracionReportesEquiposComponent,
    canActivate: [authGuard],
  },
  {
    path: 'generacion-reportes-mantenimientos',
    component: GeneracionReportesMantenimientosComponent,
    canActivate: [authGuard],
  },
  {
    path: 'generacion-reportes-obras',
    component: GeneracionReportesObrasComponent,
    canActivate: [authGuard],
  },

  {
    path: 'Solicitu-Solicitante',
    component: SolicituSolicitanteComponent,
    canActivate: [authGuard],
  },

  { path: '**', redirectTo: '' },
];
