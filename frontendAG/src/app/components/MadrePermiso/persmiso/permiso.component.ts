import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PermisoService } from '../services/permiso.service';
import { Permiso } from './../models/permiso';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-permiso',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, ReactiveFormsModule],
  templateUrl: './permiso.component.html',
  styleUrls: ['./permiso.component.css'],
})
export class PermisoComponent implements OnInit {
  permisos: Permiso[] = [];
  searchTerm: string = '';
  // Variables de paginación
  page: number = 1;
  pageSize: number = 7;
  paginatedPermisos: Permiso[] = [];

  @Output() editar = new EventEmitter<number>(); // Emit an event when editing
  @Output() registrarPermiso = new EventEmitter<number>(); // Emit an event when editing

  constructor(private permisoService: PermisoService) {}

  ngOnInit(): void {
    this.getPermisos();
  }

  getPermisos(): void {
    this.permisoService.getPermisos().subscribe((data) => {
      this.permisos = data;
      this.updatePaginatedPermisos();
      console.log(data);
    });
  }
  editarPermiso(id: number) {
    this.editar.emit(id);
  }
  registrarPermisos() {
    this.registrarPermiso.emit(); // Emit an event to register a new user
  }
  // Método para filtrar y paginar resultados
  filteredPermiso(): Permiso[] {
    let filtered = this.permisos;

    if (this.searchTerm) {
      filtered = this.permisos.filter(
        (permiso) =>
          permiso.nombre
            .toLowerCase()
            .includes(this.searchTerm.toLowerCase()) ||
          permiso.descripcion
            .toLowerCase()
            .includes(this.searchTerm.toLowerCase())
      );
    }

    return filtered.slice(
      (this.page - 1) * this.pageSize,
      this.page * this.pageSize
    );
  }
  // Método para actualizar la paginación
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
  togglePermisoActivo(permiso: Permiso) {
    // Invertir el estado de 'activo' del permiso
    const nuevoEstado = !permiso.activo;

    // Llamar a un servicio que actualice el estado del permiso en el servidor
    this.permisoService
      .editarPermiso(permiso.id, { ...permiso, activo: nuevoEstado })
      .subscribe(
        (response) => {
          console.log(
            `Permiso ${permiso.nombre} actualizado exitosamente.`,
            response
          );
          // Actualizar el estado local del permiso
          permiso.activo = nuevoEstado;
        },
        (error) => {
          console.error('Error al actualizar el estado del permiso:', error);
          // Aquí podrías mostrar un mensaje al usuario si es necesario
        }
      );
  }
}
