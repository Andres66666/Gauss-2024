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
  nombreInvalido: boolean = false; // Nueva variable para manejar la validación del nombre

  @Output() listarRol = new EventEmitter<void>();

  constructor(private rolService: RolService, private router: Router) {}
  // Método para evitar que se ingresen números
  preventNumbers(event: KeyboardEvent) {
    const regex = /^[a-zA-Z\s]*$/;
    const inputChar = String.fromCharCode(event.keyCode);

    // Si el carácter no es una letra o espacio, evitamos que se ingrese
    if (!regex.test(inputChar)) {
      event.preventDefault();
    }
  }
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
        this.errorModal = ''; // Limpiar el error
      },
      error: (error) => {
        if (error.message.includes('ya existe')) {
          this.errorModal = 'Error: ' + error.message; // Mensaje de duplicado
        } else {
          this.errorModal = 'Error al registrar el rol';
        }
        this.manejarModal = true;
      },
    });
  }
  manejarOk() {
    this.manejarModal = false; // Cerrar el modal
    this.listarRol.emit(); // Emitir el evento para listar usuarios
  }
}
