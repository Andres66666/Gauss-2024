import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Permiso, RolPermiso } from '../models/rol-permiso';
import { RolPermisoService } from '../services/rol-permiso.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { UsuarioRolComponent } from '../../Madre-Usuario-Rol/usuario-rol/usuario-rol.component';
import { PermisoComponent } from '../../MadrePermiso/persmiso/permiso.component';
import { RolComponent } from '../../MadreRol/rol/rol.component';
import { UsuarioComponent } from '../../MadreUsuario/usuario/usuario.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-rol-permiso',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    UsuarioRolComponent,
    PermisoComponent,
    RolComponent,
    UsuarioComponent,
    ReactiveFormsModule,
    FormsModule,
  ],
  templateUrl: './rol-permiso.component.html',
  styleUrl: './rol-permiso.component.css',
})
export class RolPermisoComponent implements OnInit {
  rolePermisos: RolPermiso[] = [];
  permisos: Permiso[] = [];
  searchTerm: string = '';

  // Variables de paginación
  page: number = 1;
  pageSize: number = 10;
  paginatedPermisos: Permiso[] = [];

  @Output() editar = new EventEmitter<number>();
  @Output() registrarRolPermiso = new EventEmitter<number>();

  constructor(private rolPermisoService: RolPermisoService) {}

  ngOnInit(): void {
    this.getRolePermisos();
  }

  getRolePermisos(): void {
    this.rolPermisoService.getRolePermisos().subscribe((data) => {
      this.rolePermisos = data;
      this.updatePaginatedPermisos();
      console.log(data);
    });
  }
  // metodo para realizar la busqueda por el nombre
  // Método de filtrado con paginación aplicada
  filteredRolPermiso(): RolPermiso[] {
    let filtered = this.rolePermisos;

    if (this.searchTerm) {
      filtered = this.rolePermisos.filter(
        (rolePermiso) =>
          rolePermiso.rol.nombreRol
            .toLowerCase()
            .includes(this.searchTerm.toLowerCase()) ||
          rolePermiso.permiso.nombre
            .toLowerCase()
            .includes(this.searchTerm.toLowerCase())
      );
    }

    return filtered.slice(
      (this.page - 1) * this.pageSize,
      this.page * this.pageSize
    ); // Mostramos solo la página actual
  }
  //medodo para jalar a la vista de editar permiso
  editarRolPermiso(id: number) {
    this.editar.emit(id);
  }
  //medodo para jalar a la vista de registrar permiso
  registrarRolPermisos() {
    this.registrarRolPermiso.emit(); // Emit an event to register a new user
  }

  
  // Métodos de paginación
  updatePaginatedPermisos() {
    const start = (this.page - 1) * this.pageSize;
    const end = start + this.pageSize;
    this.paginatedPermisos = this.permisos.slice(start, end);
  }

  nextPage() {
    this.page++;
    this.updatePaginatedPermisos();
  }

  previousPage() {
    if (this.page > 1) {
      this.page--;
      this.updatePaginatedPermisos();
    }
  }
}
