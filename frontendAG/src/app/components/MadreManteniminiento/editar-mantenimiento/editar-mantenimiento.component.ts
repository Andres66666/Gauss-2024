import { MantenimientoService } from './../service/mantenimiento.service';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  Almacen,
  Equipo,
  Mantenimiento,
  Obra,
} from './../models/mantenimiento';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-editar-mantenimiento',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './editar-mantenimiento.component.html',
  styleUrl: './editar-mantenimiento.component.css',
})
export class EditarMantenimientoComponent implements OnInit {
  mantenimientoForm!: FormGroup; // Formulario reactivo
  equipos: Equipo[] = []; // Lista de equipos para seleccionar
  mantenimiento!: Mantenimiento; // Mantenimiento a editar

  @Output() listarMantenimientoEditado = new EventEmitter<void>();
  @Input() mantenimientoId: number | null = null; // Allow null value

  // Propiedades adicionales
  almacenSeleccionado: any; // Cambia el tipo según tu modelo
  obraSeleccionada: any; // Cambia el tipo según tu modelo
  manejarModal: boolean = false;
  mensajeModal: string = '';
  errorModal: boolean = false;

  constructor(
    private fb: FormBuilder,
    private mantenimientoService: MantenimientoService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.getEquipos(); // Obtener la lista de equipos
    this.loadMantenimiento(); // Cargar el mantenimiento a editar
  }

  initForm() {
    this.mantenimientoForm = this.fb.group({
      fechaInicio: ['', Validators.required],
      fechaFin: ['', Validators.required],
      detalleMantenimiento: ['', Validators.required],
      responsable: ['', Validators.required],
      tipo_mantenimiento: ['', Validators.required],
      equipo: ['', Validators.required],
    });
  }

  getEquipos() {
    // Obtener la lista de equipos
    this.mantenimientoService.getEquipos().subscribe((data) => {
      this.equipos = data;
    });
  }

  loadMantenimiento() {
    // Cargar el mantenimiento por ID
    if (this.mantenimientoId !== null) {
      this.mantenimientoService
        .getMantenimientoById(this.mantenimientoId)
        .subscribe((data) => {
          this.mantenimiento = data;
          this.mantenimientoForm.patchValue({
            fechaInicio: this.mantenimiento.fechaInicio,
            fechaFin: this.mantenimiento.fechaFin,
            detalleMantenimiento: this.mantenimiento.detalleMantenimiento,
            responsable: this.mantenimiento.responsable,
            tipo_mantenimiento: this.mantenimiento.tipo_mantenimiento,
            equipo: this.mantenimiento.equipo.id, // Asumiendo que el equipo tiene un ID
          });
        });
    } else {
      console.error('El ID del mantenimiento es nulo');
    }
  }

  onSubmit() {
    if (this.mantenimientoForm.valid) {
      const updatedMantenimiento: Mantenimiento = {
        ...this.mantenimiento,
        ...this.mantenimientoForm.value,
      };

      this.mantenimientoService
        .editarMantenimiento(this.mantenimientoId!, updatedMantenimiento)
        .subscribe(() => {
          // Emitir evento para indicar que se ha editado el mantenimiento
          this.listarMantenimientoEditado.emit();
        });
    }
  }
}
