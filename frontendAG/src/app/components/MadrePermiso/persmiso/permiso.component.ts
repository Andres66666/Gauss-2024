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
  @Output() editar = new EventEmitter<number>(); // Emit an event when editing
  @Output() registrarPermiso = new EventEmitter<number>(); // Emit an event when editing

  searchTerm: string = ''; // Property for storing the search term

  constructor(private permisoService: PermisoService) {}

  ngOnInit(): void {
    this.getPermisos();
  }

  getPermisos(): void {
    this.permisoService.getPermisos().subscribe((data) => {
      this.permisos = data;
      console.log(data);
    });
  }
  editarPermiso(id: number) {
    this.editar.emit(id);
  }
  registrarPermisos() {
    this.registrarPermiso.emit(); // Emit an event to register a new user
  }
  filteredPermiso(): Permiso[] {
    if (!this.searchTerm) {
      return this.permisos;
    }
    return this.permisos.filter((permiso) =>
      permiso.nombre.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }
  togglePermisoActivo(permiso: Permiso) {
    // Invertir el estado de 'activo' del permiso
    permiso.activo = !permiso.activo;

    // Llamar a un servicio que actualice el estado del permiso en el servidor
    this.permisoService
      .editarPermiso(permiso.id, { ...permiso, activo: permiso.activo })
      .subscribe(
        (response) => {
          console.log(`Permiso ${permiso.nombre} actualizado exitosamente.`);
        },
        (error) => {
          console.error('Error al actualizar el estado del permiso:', error);
        }
      );
  }
}
