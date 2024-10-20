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
    // Forzar que siempre se registre como true
    this.obra.estadoObra = true;
    this.obraServise.registrarObra(this.obra).subscribe({
      next: () => {
        this.obra = {
          id: 0,
          nombreObra: '',
          ubicacionObra: '',
          estadoObra: true,
        };
        this.mensajeModal = 'Obra registrado exitosamente'; // Mensaje para el modal
        this.manejarModal = true;
      },
      error: (error) => {
        this.errorModal = 'Error al registrar el Obra';
        this.manejarModal = true;
      },
    });
  }
  manejarOk() {
    this.manejarModal = false; // Cerrar el modal
    this.listarObras.emit(); // Emitir el evento para listar usuarios
  }
}
