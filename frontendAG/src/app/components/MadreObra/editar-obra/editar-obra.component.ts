import { Component, Input, OnInit } from '@angular/core';
import { Obra } from '../models/obra';
import { CommonModule } from '@angular/common';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ObraService } from '../service/obra.service';

@Component({
  selector: 'app-editar-obra',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './editar-obra.component.html',
  styleUrl: './editar-obra.component.css',
})
export class EditarObraComponent implements OnInit {
  obra: Obra = {
    id: 0,
    nombreObra: '',
    ubicacionObra: '',
    estadoObra: true,
  };
  form!: FormGroup; // Declare form as a class property
  successMessage: string = '';
  errorMessage: string = '';
  @Input() obraId: number | null = null; // Allow null value

  constructor(private obraServise: ObraService) {}

  ngOnInit(): void {
    if (this.obraId !== null) {
      this.loadPermisoData(this.obraId);
    } else {
      console.error('obras is null or undefined');
    }
  }
  loadPermisoData(id: number) {
    this.obraServise.getObraById(id).subscribe({
      next: (data) => {
        this.obra = data;
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
      nombreObra: new FormControl(this.obra.nombreObra, Validators.required),
      ubicacionObra: new FormControl(this.obra.ubicacionObra),
      estadoObra: new FormControl(this.obra.estadoObra),
    });
  }
  submit() {
    if (this.form.invalid) {
      this.errorMessage = 'porfavor complete todos los campos requeridos';
      return;
    }
    const updatedObra = { ...this.obra, ...this.form.value };
    this.obraServise.editarObra(this.obra.id, updatedObra).subscribe({
      next: (data) => {
        console.log(data);
        this.successMessage = 'Rol actualizado con exito';
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      },
      error: (error) => {
        this.errorMessage = 'Error al actualizar el obra';
        console.error('Error al actualizar el obra');
      },
    });
  }
}
