import { Component } from '@angular/core';
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
  successMessage: string = '';
  errorMessage: string = '';
  constructor(private rolService: RolService, private router: Router) {}

  registrarRol(): void {
    this.rolService.registrarRol(this.rol).subscribe({
      next: () => {
        this.successMessage = 'Rol registrado exitosamente.';
        this.rol = {
          id: 0,
          nombreRol: '',
          activo: true,
        };
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      },
      error: (error) => {
        this.errorMessage = 'Error al registrar el usuario';
        console.error(error);
      },
    });
  }
}
