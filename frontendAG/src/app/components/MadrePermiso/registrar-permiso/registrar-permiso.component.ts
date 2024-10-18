import { Component, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PermisoService } from '../services/permiso.service';
import { Permiso } from '../models/permiso';

@Component({
  selector: 'app-registrar-permiso',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './registrar-permiso.component.html',
  styleUrl: './registrar-permiso.component.css',
})
export class RegistrarPermisoComponent {
  permiso: Permiso = {
    id: 0,
    nombre: '',
    descripcion: '',
    activo: true,
  };
  manejarModal: boolean = false;
  mensajeModal: string = '';
  errorModal: string = '';
  @Output() listarPermiso = new EventEmitter<void>();

  constructor(private permisoService: PermisoService) {}

  registrarPermiso(): void {
    this.permisoService.registrarPermiso(this.permiso).subscribe({
      next: () => {
        this.permiso = {
          id: 0,
          nombre: '',
          descripcion: '',
          activo: true,
        };
        this.mensajeModal = 'Permiso registrado exitosa mente'; // Mensaje para el modal
        this.manejarModal = true; // Mostrar el modal
      },
      error: (error) => {
        this.errorModal = 'Error al registrar el usuario';
        this.manejarModal = true;
      },
    });
  }
  manejarOk() {
    this.manejarModal = false; // Cerrar el modal
    this.listarPermiso.emit(); // Emitir el evento para listar usuarios
  }
}
