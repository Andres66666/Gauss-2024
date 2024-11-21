import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Equipo, Mantenimiento } from '../models/mantenimiento';
import { MantenimientoService } from '../service/mantenimiento.service';
import { CommonModule } from '@angular/common';
import { Observable, of } from 'rxjs';

@Component({
  selector: 'app-registrar-mantenimiento',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './registrar-mantenimiento.component.html',
  styleUrl: './registrar-mantenimiento.component.css',
})
export class RegistrarMantenimientoComponent implements OnInit {
  mantenimientoForm: FormGroup;
  equipos$: Observable<Equipo[]> = of([]); // Inicializar con un Observable vacío
  isEditing: boolean = false;

  @Output() listarMantenimiento = new EventEmitter<void>();

  constructor(
    private fb: FormBuilder,
    private mantenimientoService: MantenimientoService
  ) {
    this.mantenimientoForm = this.fb.group({
      fechaInicio: ['', Validators.required],
      fechaFin: ['', Validators.required],
      detalleMantenimiento: ['', Validators.required],
      responsable: ['', Validators.required],
      tipo_mantenimiento: ['', Validators.required], // 'preventivo' o 'correctivo'
      equipo: [null, Validators.required], // ID del equipo
    });
  }

  ngOnInit(): void {
    this.equipos$ = this.mantenimientoService.getEquipos(); // Obtener la lista de equipos
  }

  onSubmit(): void {
    if (this.mantenimientoForm.valid) {
      const mantenimiento: Mantenimiento = {
        id: 0, // Asumimos que es un nuevo mantenimiento, por lo que el ID es 0
        ...this.mantenimientoForm.value,
      };

      // Crear nuevo mantenimiento
      this.mantenimientoService.createMantenimiento(mantenimiento).subscribe({
        next: () => {
          console.log('Mantenimiento creado con éxito');
          this.listarMantenimiento.emit(); // Emitir el evento para listar mantenimientos
        },
        error: (err) => {
          console.error('Error al crear el mantenimiento:', err);
        },
      });
    }
  }

  manejarOk() {
    this.listarMantenimiento.emit(); // Emitir el evento para listar usuarios
  }
}
