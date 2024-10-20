import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { RolService } from '../services/rol.service';
import { Rol } from '../models/rol';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-rol',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, FormsModule],
  templateUrl: './rol.component.html',
  styleUrl: './rol.component.css',
})
export class RolComponent {
  roles: Rol[] = [];
  searchTerm: string = '';

  // Variables de paginación
  page: number = 1;
  pageSize: number = 10;
  paginatedRoles: Rol[] = [];

  @Output() editar = new EventEmitter<number>();
  @Output() registrar_Rol = new EventEmitter<number>();

  constructor(private rolService: RolService, private router: Router) {}

  ngOnInit(): void {
    this.getRoles();
  }

  getRoles() {
    this.rolService.getRoles().subscribe((data) => {
      this.roles = data;
      this.updatePaginatedRoles(); // Actualiza la paginación
    });
  }

  // Método para editar rol
  editarRol(id: number) {
    this.editar.emit(id);
  }

  // Método para registrar rol
  registrarRol() {
    this.registrar_Rol.emit();
  }

  // Método de filtrado con paginación aplicada
  filteredRol(): Rol[] {
    let filtered = this.roles;

    if (this.searchTerm) {
      filtered = this.roles.filter((rol) =>
        rol.nombreRol.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }

    return filtered.slice(
      (this.page - 1) * this.pageSize,
      this.page * this.pageSize
    ); // Mostramos solo la página actual
  }

  // Métodos de paginación
  updatePaginatedRoles() {
    const start = (this.page - 1) * this.pageSize;
    const end = start + this.pageSize;
    this.paginatedRoles = this.roles.slice(start, end);
  }

  nextPage() {
    if (this.page * this.pageSize < this.roles.length) {
      this.page++;
      this.updatePaginatedRoles();
    }
  }

  previousPage() {
    if (this.page > 1) {
      this.page--;
      this.updatePaginatedRoles();
    }
  }

  // Método para cambiar el estado del rol
  toggleRolActivo(rol: Rol) {
    rol.activo = !rol.activo;

    this.rolService.editarRol(rol.id, { ...rol, activo: rol.activo }).subscribe(
      (response) => {
        console.log(`Rol ${rol.nombreRol} actualizado exitosamente.`);
      },
      (error) => {
        console.error('Error al actualizar el estado del rol:', error);
      }
    );
  }
}
