import { Component, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Rol } from '../models/rol';
import { RolService } from '../services/rol.service';

@Component({
  selector: 'app-registrar-rol',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './registrar-rol.component.html',
  styleUrl: './registrar-rol.component.css',
})
export class RegistrarRolComponent {
  rol: Rol = {
    id: 0,
    nombreRol: '',
    activo: true,
  };
  manejarModal: boolean = false;
  mensajeModal: string = '';
  errorModal: string = '';

  @Output() listarRol = new EventEmitter<void>();

  constructor(private rolService: RolService, private router: Router) {}

  registrarRol(): void {
    this.rolService.registrarRol(this.rol).subscribe({
      next: () => {
        this.rol = {
          id: 0,
          nombreRol: '',
          activo: true,
        };
        this.mensajeModal = 'Rol registrado exitosamente'; // Mensaje para el modal
        this.manejarModal = true; // Mostrar el modal
      },
      error: (error) => {
        this.errorModal = 'Error al registrar el rol';
        this.manejarModal = true;
      },
    });
  }
  manejarOk() {
    this.manejarModal = false; // Cerrar el modal
    this.listarRol.emit(); // Emitir el evento para listar usuarios
  }
}
