import { Component } from '@angular/core';
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
  successMessage: string = '';
  errorMessage: string = '';
  constructor(private permisoService: PermisoService) {}

  registrarPermiso(): void {
    this.permisoService.registrarPermiso(this.permiso).subscribe({
      next: () => {
        this.successMessage = 'Permiso registrado exitosa mente';
        this.permiso = {
          id: 0,
          nombre: '',
          descripcion: '',
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
