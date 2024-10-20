import { Usuario } from './../../MadreUsuario/models/usuario';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { UsuarioRol } from '../models/usuario-rol';
import { UsuarioRolService } from '../services/usuario-rol.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-usuario-rol',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './usuario-rol.component.html',
  styleUrl: './usuario-rol.component.css',
})
export class UsuarioRolComponent implements OnInit {
  usuarioRoles: UsuarioRol[] = [];
  searchTerm: string = ''; // Property for storing the search term
  // Variables de paginación
  page: number = 1;
  pageSize: number = 10;
  paginatedUsuarioroles: UsuarioRol[] = [];

  @Output() editar = new EventEmitter<number>();
  @Output() registrarUsuarioPermiso = new EventEmitter<number>();

  constructor(private usuarioRolService: UsuarioRolService) {}

  ngOnInit(): void {
    this.getUsuarioRoles();
  }

  getUsuarioRoles() {
    this.usuarioRolService.getUsuarioRoles().subscribe((data) => {
      this.usuarioRoles = data;
      this.updatePaginatedUsuarioroles();
      console.log(data);
    });
  }
  // Método de filtrado con paginación aplicada
  filteredUsuarioRol(): UsuarioRol[] {
    let filtered = this.usuarioRoles;

    if (this.searchTerm) {
      filtered = this.usuarioRoles.filter((usuarioRol) =>
        usuarioRol.usuario.nombreUsuario
          .toLowerCase()
          .includes(this.searchTerm.toLowerCase())
      );
    }

    return filtered.slice(
      (this.page - 1) * this.pageSize,
      this.page * this.pageSize
    ); // Mostramos solo la página actual
  }
  editarRolPermiso(id: number) {
    this.editar.emit(id);
  }
  registrarUsuarioRol() {
    this.registrarUsuarioPermiso.emit();
  }
  // Métodos de paginación
  updatePaginatedUsuarioroles() {
    const start = (this.page - 1) * this.pageSize;
    const end = start + this.pageSize;
    this.paginatedUsuarioroles = this.usuarioRoles.slice(start, end);
  }

  nextPage() {
    this.page++;
    this.updatePaginatedUsuarioroles();
  }

  previousPage() {
    if (this.page > 1) {
      this.page--;
      this.updatePaginatedUsuarioroles();
    }
  }
}
