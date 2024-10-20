import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
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
  manejarModal: boolean = false;
  mensajeModal: string = '';
  errorModal: string = '';
  @Output() listarObras = new EventEmitter<void>();
  constructor(private obraServise: ObraService) {}

  registrarObra(): void {
    this.obra.estadoObra = true; // Forzar que siempre se registre como true

    console.log('Datos a enviar:', this.obra); // Log de los datos

    this.obraServise.registrarObra(this.obra).subscribe({
      next: () => {
        this.obra = {
          id: 0,
          nombreObra: '',
          ubicacionObra: '',
          estadoObra: true,
          fecha_creacion_obra: undefined, // opcional
          fecha_cierre_obra: undefined, // opcional
        };
        this.mensajeModal = 'Obra registrada exitosamente';
        this.manejarModal = true;
      },
      error: (error) => {
        this.errorModal = 'Error al registrar la obra';
        console.error('Error al registrar la obra:', error); // Log del error
        this.manejarModal = true;
      },
    });
  }
  manejarOk() {
    this.manejarModal = false; // Cerrar el modal
    this.listarObras.emit(); // Emitir el evento para listar usuarios
  }
}
