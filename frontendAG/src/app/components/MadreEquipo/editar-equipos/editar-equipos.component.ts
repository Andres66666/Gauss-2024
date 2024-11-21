import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
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

  manejarModal: boolean = false;
  mensajeModal: string = '';
  errorModal: string = '';

  imagenPreview: string | ArrayBuffer | null = null;
  @Input() equipoId: number | null = null;
  @Output() listarEquipoEditado = new EventEmitter<void>();

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
    });
  }

  loadEquipoData(id: number) {
    this.equiposService.getEquipoById(id).subscribe({
      next: (data) => {
        this.equipo = data;
        console.log('Datos del equipo:', this.equipo); // Verifica que el valor sea correcto
        this.initializeForm();
      },
    });
  }

  initializeForm() {
    this.form = new FormGroup({
      codigoEquipo: new FormControl(
        this.equipo.codigoEquipo,
        Validators.required
      ),
      nombreEquipo: new FormControl(
        this.equipo.nombreEquipo,
        Validators.required
      ),
      marcaEquipo: new FormControl(
        this.equipo.marcaEquipo,
        Validators.required
      ),
      modeloEquipo: new FormControl(
        this.equipo.modeloEquipo,
        Validators.required
      ),
      estadoEquipo: new FormControl(
        this.equipo.estadoEquipo,
        Validators.required
      ),

      estadoDisponibilidad: new FormControl(
        this.equipo.estadoDisponibilidad,
        Validators.required
      ),
      vidaUtilEquipo: new FormControl(
        this.equipo.vidaUtilEquipo,
        Validators.required
      ),
      fechaAdquiscion: new FormControl(
        this.equipo.fechaAdquiscion,
        Validators.required
      ),
      fechaFabricacion: new FormControl(
        this.equipo.fechaFabricacion,
        Validators.required
      ),
      horasUso: new FormControl(this.equipo.horasUso, Validators.required),
      edadEquipo: new FormControl(this.equipo.edadEquipo, Validators.required),
      imagenEquipos: new FormControl(null), // Inicializar el control de la imagen
      cantMantPreventivos: new FormControl(
        this.equipo.cantMantPreventivos,
        Validators.required
      ),
      cantMantCorrectivos: new FormControl(
        this.equipo.cantMantCorrectivos,
        Validators.required
      ),
      numFallasReportdas: new FormControl(
        this.equipo.numFallasReportdas,
        Validators.required
      ),
      almacen: new FormControl(this.equipo.almacen.id, Validators.required),
    });

    // Asignar la imagen previa si existe
    if (this.equipo.imagenEquipos_url) {
      this.imagenPreview = this.equipo.imagenEquipos_url;
    }
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
      updatedEquipo.append('codigoEquipo', this.form.value.codigoEquipo);
      updatedEquipo.append('nombreEquipo', this.form.value.nombreEquipo);
      updatedEquipo.append('marcaEquipo', this.form.value.marcaEquipo);
      updatedEquipo.append('modeloEquipo', this.form.value.modeloEquipo);
      updatedEquipo.append('estadoEquipo', this.form.value.estadoEquipo);
      updatedEquipo.append(
        'estadoDisponibilidad',
        this.form.value.estadoDisponibilidad
      );
      updatedEquipo.append('vidaUtilEquipo', this.form.value.vidaUtilEquipo);
      updatedEquipo.append('fechaAdquiscion', this.form.value.fechaAdquiscion);
      updatedEquipo.append(
        'fechaFabricacion',
        this.form.value.fechaFabricacion
      );
      updatedEquipo.append('horasUso', this.form.value.horasUso.toString());
      updatedEquipo.append('edadEquipo', this.form.value.edadEquipo);
      updatedEquipo.append(
        'cantMantPreventivos',
        this.form.value.cantMantPreventivos.toString()
      );
      updatedEquipo.append(
        'cantMantCorrectivos',
        this.form.value.cantMantCorrectivos.toString()
      );
      updatedEquipo.append(
        'numFallasReportdas',
        this.form.value.numFallasReportdas.toString()
      );
      updatedEquipo.append('almacen', this.form.value.almacen.toString());

      // Si hay una nueva imagen, agregarla al FormData
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
            this.mensajeModal = 'Equipo actualizado con éxito';
            this.manejarModal = true;
          },
          error: (err) => {
            this.errorModal = 'Error al actualizar el Equipo';
            this.manejarModal = true;
          },
        });
    }
  }
  manejarOk() {
    this.manejarModal = false;
    this.listarEquipoEditado.emit();
  }
}
