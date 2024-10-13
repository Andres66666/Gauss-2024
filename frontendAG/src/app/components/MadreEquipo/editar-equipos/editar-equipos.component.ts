import { Component, Input, OnInit } from '@angular/core';
import { Almacen, Equipo, Obra } from '../models/equipos';
import { EquiposService } from '../service/equipos.service';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-editar-equipos',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './editar-equipos.component.html',
  styleUrl: './editar-equipos.component.css',
})
export class EditarEquiposComponent implements OnInit {
  equipo!: Equipo;
  almacenes: Almacen[] = [];

  form!: FormGroup;
  successMessage: string = '';
  errorMessage: string = '';
  @Input() equipoId: number | null = null;
  imagenPreview: string | ArrayBuffer | null = null;

  mensaje: string = '';
  esExito: boolean = false;

  constructor(private equiposService: EquiposService) {}

  ngOnInit(): void {
    this.loadAlmacenes();
    if (this.equipoId !== null) {
      this.loadEquipoData(this.equipoId);
    } else {
      console.error('Equipo Id is null or undefined');
    }
  }

  loadAlmacenes(): void {
    this.equiposService.getAlmacen().subscribe({
      next: (almacen) => {
        this.almacenes = almacen;
      },
      error: (error) => {
        console.error('Error al cargar los almacenes:', error);
      },
    });
  }

  loadEquipoData(id: number) {
    this.equiposService.getEquipoById(id).subscribe({
      next: (data) => {
        this.equipo = data;
        this.initializeForm();
        this.imagenPreview = this.equipo.imagenEquipos_url; // Mostrar imagen antigua
      },
      error: (error) => {
        this.errorMessage = 'Error al cargar los datos del equipo.';
        console.error('Error loading equipo data:', error);
      },
    });
  }

  initializeForm() {
    this.form = new FormGroup({
      nombreEquipo: new FormControl(
        this.equipo.nombreEquipo,
        Validators.required
      ),
      marca: new FormControl(this.equipo.marca, Validators.required),
      modelo: new FormControl(this.equipo.modelo, Validators.required),
      estadoUsoEquipo: new FormControl(
        this.equipo.estadoUsoEquipo,
        Validators.required
      ),
      vidaUtil: new FormControl(this.equipo.vidaUtil, Validators.required),
      fechaAdquiscion: new FormControl(
        this.equipo.fechaAdquiscion,
        Validators.required
      ),
      almacen: new FormControl(this.equipo.almacen.id, Validators.required),
      imagenEquipos: new FormControl(null), // Inicializar el control de la imagen
    });
  }

  onImageChange(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.imagenPreview = reader.result; // Set image preview
      };
      reader.readAsDataURL(file);
      this.form.patchValue({ imagenEquipos: file });
    }
  }

  onSubmit(): void {
    if (this.form.valid) {
      const updatedEquipo: FormData = new FormData();
      updatedEquipo.append('id', this.equipo.id.toString());
      updatedEquipo.append('nombreEquipo', this.form.value.nombreEquipo);
      updatedEquipo.append('marca', this.form.value.marca);
      updatedEquipo.append('modelo', this.form.value.modelo);
      updatedEquipo.append('estadoUsoEquipo', this.form.value.estadoUsoEquipo);
      updatedEquipo.append('vidaUtil', this.form.value.vidaUtil);
      updatedEquipo.append('fechaAdquiscion', this.form.value.fechaAdquiscion);
      updatedEquipo.append(
        'almacen',
        JSON.stringify({ id: this.form.value.almacen })
      );

      if (this.form.value.imagenEquipos) {
        updatedEquipo.append('imagenEquipos', this.form.value.imagenEquipos);
      }

      // Verificar datos a enviar
      console.log('Datos a enviar:', updatedEquipo);

      // Editar equipo
      this.equiposService
        .editarEquipo(this.equipo.id, updatedEquipo)
        .subscribe({
          next: () => {
            this.mensaje = 'Equipo actualizado exitosamente';
            this.esExito = true;
            setTimeout(() => {
              window.location.reload();
            }, 2000);
          },
          error: (err) => {
            this.errorMessage =
              'Error al actualizar el Equipo. Por favor, intenta nuevamente.';
            console.error('Error al actualizar el Equipo:', err);
          },
        });
    } else {
      this.errorMessage =
        'El formulario no es válido. Por favor, revisa los campos.';
    }
  }
}
