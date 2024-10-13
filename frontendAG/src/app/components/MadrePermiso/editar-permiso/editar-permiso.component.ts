import { Component, Input, OnInit } from '@angular/core';
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
  successMessage: string = '';
  errorMessage: string = '';

  @Input() permisoId: number | null = null; // Allow null value

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
      error: (error) => {
        this.errorMessage = 'Error al cargar los datos de los permisos';
        console.error('Error al cargar los datos:', error);
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
      this.errorMessage = 'porfavor complete todos los campos requeridos';
      return;
    }
    const updatedPermiso = { ...this.permiso, ...this.form.value };
    this.permisoService
      .editarPermiso(this.permiso.id, updatedPermiso)
      .subscribe({
        next: (data) => {
          console.log(data);
          this.successMessage = 'Rol actualizado con exito';
          setTimeout(() => {
            window.location.reload();
          }, 1000);
        },
        error: (error) => {
          this.errorMessage = 'Error al actualizar el permiso';
          console.error('Error al actualizar el permiso');
        },
      });
  }
}
