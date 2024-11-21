import { CommonModule } from '@angular/common';
import { SolicitudesService } from './../services/solicitudes.service';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Equipo, Obra, Solicitudes, Usuario } from '../models/solicitudes';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-editar-solicitudes',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './editar-solicitudes.component.html',
  styleUrl: './editar-solicitudes.component.css',
})
export class EditarSolicitudesComponent {
  solicitudes!: Solicitudes;
  equipo: Equipo[] = [];
  obra: Obra[] = [];
  usuario: Usuario[] = [];

  form!: FormGroup; // Declare form as a class property
  manejarModal: boolean = false;
  mensajeModal: string = '';
  errorModal: string = '';

  @Input() solicitudId: number | null = null;
  @Output() listarSolicitudEditado = new EventEmitter<void>();

  constructor(
    private solicitudesService: SolicitudesService,
    private fb: FormBuilder
  ) {
    this.form = this.fb.group({
      codigoSolicitud: ['', Validators.required],
      fecha_solicitud: ['', Validators.required],
      fecha_retorno_estimada: ['', Validators.required],
      fecha_retorno_real: [''],
      estado: ['pendiente'], // Valor por defecto
      motivo_uso: ['', Validators.required],
      fecha_uso: [''],
      equipo: ['', Validators.required],
      usuario: ['', Validators.required],
      descripcion_falla: [''],
      cantidad_fallas_solicitud: [0],
      horas_uso_solicitud: [0],
    });
  }

  ngOnInit(): void {
    this.loadEquipo();
    this.loadObras();
    this.loadUsuario();
    if (this.solicitudId !== null) {
      this.loadSolicitudData(this.solicitudId);
    } else {
      console.error('solicitudId is null or undefined');
    }
  }

  loadEquipo(): void {
    this.solicitudesService.getEquipos().subscribe({
      next: (equipo) => {
        this.equipo = equipo;
      },
      error: (error) => {
        console.error('Error al cargar los equipos:', error);
      },
    });
  }

  loadUsuario(): void {
    this.solicitudesService.getUsuario().subscribe({
      next: (usuario) => {
        this.usuario = usuario;
      },
    });
  }

  loadObras(): void {
    this.solicitudesService.getObras().subscribe({
      next: (obra) => {
        this.obra = obra;
      },
    });
  }

  loadSolicitudData(id: number) {
    this.solicitudesService.getSolicitudesById(id).subscribe({
      next: (data) => {
        this.solicitudes = data; // Populate form with user data
        this.initializeForm(); // Initialize form after loading user data
      },
      error: (error) => {
        console.error('Error al cargar la solicitud:', error);
      },
    });
  }

  initializeForm() {
    this.form.patchValue({
      codigoSolicitud: this.solicitudes.codigoSolicitud,
      fecha_solicitud: this.solicitudes.fecha_solicitud,
      fecha_retorno_estimada: this.solicitudes.fecha_retorno_estimada,
      fecha_retorno_real: this.solicitudes.fecha_retorno_real,
      estado: this.solicitudes.estado,
      motivo_uso: this.solicitudes.motivo_uso,
      fecha_uso: this.solicitudes.fecha_uso,
      equipo: this.solicitudes.equipo.id, // Asegúrate de que 'equipo' tenga un campo 'id'
      usuario: this.solicitudes.usuario.id, // Asegúrate de que 'usuario' tenga un campo 'id'
      descripcion_falla: this.solicitudes.descripcion_falla,
      cantidad_fallas_solicitud: this.solicitudes.cantidad_fallas_solicitud,
      horas_uso_solicitud: this.solicitudes.horas_uso_solicitud,
    });
  }
  onSubmit(): void {
    if (this.form.valid) {
      const updatedSolicitud = { ...this.form.value };
      console.log('Valores enviados:', updatedSolicitud); // Verifica los valores

      this.solicitudesService
        .updateSolicitud(this.solicitudId!, updatedSolicitud)
        .subscribe({
          next: () => {
            this.mensajeModal = 'Solicitud actualizada con éxito';
            this.manejarModal = true; // Mostrar modal de éxito
            this.listarSolicitudEditado.emit(); // Emitir evento para actualizar la lista
          },
          error: (error) => {
            console.error('Error al actualizar la solicitud:', error);
            this.errorModal =
              'Error al actualizar la solicitud. Intente nuevamente.';
            this.manejarModal = true; // Mostrar modal de error
          },
        });
    } else {
      this.errorModal = 'Por favor, complete todos los campos requeridos.';
      this.manejarModal = true; // Mostrar modal de error
    }
  }

  manejarOk() {
    this.manejarModal = false;
    this.listarSolicitudEditado.emit();
  }
}
