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
export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  /* { path: '', redirectTo: '/login', pathMatch: 'full' }, */
  { path: 'login', component: LoginComponent },
  { path: 'index', component: IndexComponent },
  { path: 'usuario', component: UsuarioComponent },
  { path: 'rol', component: RolComponent },
  { path: 'permiso', component: PermisoComponent },
  { path: 'usuario-rol', component: UsuarioRolComponent },
  { path: 'rol-permiso', component: RolPermisoComponent },

  /* seccion de registrar editar  */
  { path: 'registrar-usuario', component: RegistrarUsuarioComponent },
  { path: 'editar-usuario/:id', component: EditarUsuarioComponent },

  { path: 'registrar-rol', component: RegistrarRolComponent },
  { path: 'editar-rol', component: EditarRolComponent },

  { path: 'registrar-permiso', component: RegistrarPermisoComponent },
  { path: 'editar-permiso', component: EditarPermisoComponent },

  { path: 'registrar-rolpermiso', component: RegistrarRolpermisoComponent },
  { path: 'editar-rolpermiso/:id', component: EditarRolpermisoComponent },

  { path: 'registrar-usuariorol', component: RegistrarUsuariorolComponent },
  { path: 'editar-usuariorol/:id', component: EditarUsuariorolComponent },

  { path: 'registrar-obra', component: RegistrarObraComponent },
  { path: 'editar-obra/:id', component: EditarObraComponent },
  { path: 'listar-obra', component: ListarObraComponent },

  { path: 'registrar-almacen', component: RegistrarAlmacenComponent },
  { path: 'editar-almacen/:id', component: EditarAlmacenComponent },
  { path: 'listar-almacen', component: ListarAlmacenComponent },

  { path: 'registrar-equipo', component: RegistrarEquiposComponent },
  { path: 'editar-equipo/:id', component: EditarEquiposComponent },
  { path: 'listar-equipo', component: ListarEquiposComponent },

  {
    path: 'registrar-mantenimiento',
    component: RegistrarMantenimientoComponent,
  },
  { path: 'editar-mantenimiento/:id', component: EditarMantenimientoComponent },
  { path: 'listar-mantenimiento', component: ListarMantenimientoComponent },

  { path: 'registrar-solicitud', component: RegistrarSolicitudesComponent },
  { path: 'editar-solicitud/:id', component: EditarSolicitudesComponent },
  { path: 'listar-solicitud', component: ListarSolicitudesComponent },

  { path: 'listar-equipo-O', component: ListarEquiposOComponent },

  { path: '**', redirectTo: '' },
];
