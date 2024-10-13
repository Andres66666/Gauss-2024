import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { RolPermiso } from '../models/rol-permiso';
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
  @Output() editar = new EventEmitter<number>(); // Emit an event when editing
  searchTerm: string = ''; // Property for storing the search term

  constructor(private rolPermisoService: RolPermisoService) {}

  ngOnInit(): void {
    this.getRolePermisos();
  }

  getRolePermisos(): void {
    this.rolPermisoService.getRolePermisos().subscribe((data) => {
      this.rolePermisos = data;
      console.log(data);
    });
  }
  // metodo para realizar la busqueda por el nombre
  filteredRolPermiso(): RolPermiso[] {
    if (!this.searchTerm) {
      return this.rolePermisos;
    }
    return this.rolePermisos.filter((rolePermiso) =>
      rolePermiso.rol.nombreRol
        .toLowerCase()
        .includes(this.searchTerm.toLowerCase())
    );
  }
  //medodo para jalar a la vista de editar permiso
  editarRolPermiso(id: number) {
    this.editar.emit(id);
  }
}
