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
        this.errorModal = ''; // Limpiar el error
      },
      error: (error) => {
        if (error.message.includes('ya existe')) {
          this.errorModal = 'Error: ' + error.message; // Mensaje de duplicado
        } else {
          this.errorModal = 'Error al registrar el permiso';
        }
        this.manejarModal = true;
      },
    });
  }
  manejarOk() {
    this.manejarModal = false; // Cerrar el modal
    this.listarPermiso.emit(); // Emitir el evento para listar usuarios
  }
  // Método para validar que solo se ingresen letras en el campo "nombre"
  validarNombre(): boolean {
    const pattern = /^[a-zA-Z\s]+$/; // Solo permite letras y espacios
    return pattern.test(this.permiso.nombre);
  }
  preventNumbers(event: KeyboardEvent) {
    const regex = /^[a-zA-Z\s]*$/;
    const inputChar = String.fromCharCode(event.keyCode);

    // Si el carácter no es una letra o espacio, evitamos que se ingrese
    if (!regex.test(inputChar)) {
      event.preventDefault();
    }
  }

  // Método para verificar si ambos campos están llenos y cumplen las validaciones
  camposValidos(): boolean {
    return (
      this.permiso.nombre.trim() !== '' &&
      this.permiso.descripcion.trim() !== '' &&
      this.validarNombre() // Verifica si el nombre es válido
    );
  }
}
