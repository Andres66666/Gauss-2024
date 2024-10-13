import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Obra } from '../models/obra';
import { ObraService } from '../service/obra.service';

@Component({
  selector: 'app-registrar-obra',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './registrar-obra.component.html',
  styleUrl: './registrar-obra.component.css',
})
export class RegistrarObraComponent {
  obra: Obra = {
    id: 0,
    nombreObra: '',
    ubicacionObra: '',
    estadoObra: true,
  };
  successMessage: string = '';
  errorMessage: string = '';

  constructor(private obraServise: ObraService) {}

  registrarObra(): void {
    this.obraServise.registrarObra(this.obra).subscribe({
      next: () => {
        this.successMessage = 'Permiso registrado exitosa mente';
        this.obra = {
          id: 0,
          nombreObra: '',
          ubicacionObra: '',
          estadoObra: true,
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
