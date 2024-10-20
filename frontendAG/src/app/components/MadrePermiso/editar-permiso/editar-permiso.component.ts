import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Permiso } from '../models/permiso';
import { CommonModule } from '@angular/common';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { PermisoService } from '../services/permiso.service';

@Component({
  selector: 'app-editar-permiso',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './editar-permiso.component.html',
  styleUrl: './editar-permiso.component.css',
})
export class EditarPermisoComponent implements OnInit {
  permiso: Permiso = {
    id: 0,
    nombre: '',
    descripcion: '',
    activo: true,
  };
  form!: FormGroup; // Declare form as a class property
  manejarModal: boolean = false;
  mensajeModal: string = '';
  errorModal: string = '';

  @Input() permisoId: number | null = null; // Allow null value
  @Output() listarPermisoEditado = new EventEmitter<void>();

  constructor(private permisoService: PermisoService) {}

  ngOnInit(): void {
    if (this.permisoId !== null) {
      this.loadPermisoData(this.permisoId);
    } else {
      console.error('permisoID is null or undefined');
    }
  }

  loadPermisoData(id: number) {
    this.permisoService.getPermisoById(id).subscribe({
      next: (data) => {
        this.permiso = data;
        this.initializerFrom();
      },
    });
  }

  initializerFrom() {
    this.form = new FormGroup({
      nombre: new FormControl(this.permiso.nombre, Validators.required),
      descripcion: new FormControl(this.permiso.descripcion),
      activo: new FormControl(this.permiso.activo),
    });
  }

  submit() {
    if (this.form.invalid) {
      return;
    }
    const updatedPermiso = { ...this.permiso, ...this.form.value };
    this.permisoService
      .editarPermiso(this.permiso.id, updatedPermiso)
      .subscribe({
        next: (data) => {
          console.log(data);
          this.mensajeModal = 'Permiso actualizado con éxito';
          this.manejarModal = true;
        },
        error: (error) => {
          if (error.message.includes('ya existe')) {
            this.errorModal = 'Error al editar: \n' + error.message; // Mensaje de duplicado
          } else {
            this.errorModal = 'Error al registrar el permiso';
          }
          this.manejarModal = true;
        },
      });
  }
  preventNumbers(event: KeyboardEvent) {
    const regex = /^[a-zA-Z\s]*$/;
    const inputChar = String.fromCharCode(event.keyCode);

    // Si el carácter no es una letra o espacio, evitamos que se ingrese
    if (!regex.test(inputChar)) {
      event.preventDefault();
    }
  }
  manejarOk() {
    this.manejarModal = false; // Cerrar el modal
    this.listarPermisoEditado.emit(); // Emitir el evento para listar usuarios
  }
}
