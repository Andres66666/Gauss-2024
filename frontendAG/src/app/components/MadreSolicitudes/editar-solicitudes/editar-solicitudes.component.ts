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
      fechaSolicitud: ['', Validators.required],
      fechaRetornoEstimada: ['', Validators.required],
      fechaRetornoReal: ['', Validators.required],

      equipo: ['', Validators.required],
      obra: ['', Validators.required],
      usuario: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.loadEquipo();
    this.loadObras();
    this.loadUsuario();
    if (this.solicitudId !== null) {
      this.loadSolicitudData(this.solicitudId);
    } else {
      console.error('usuarioId is null or undefined');
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
    });
  }
  initializeForm() {
    this.form = new FormGroup({
      fechaSolicitud: new FormControl(this.solicitudes.fechaSolicitud),
      fechaRetornoEstimada: new FormControl(
        this.solicitudes.fechaRetornoEstimada
      ),
      fechaRetornoReal: new FormControl(this.solicitudes.fechaRetornoReal),
      equipo: new FormControl(this.solicitudes.equipo.id, Validators.required),
      obra: new FormControl(this.solicitudes.obra.id, Validators.required),
      usuario: new FormControl(
        this.solicitudes.usuario.id,
        Validators.required
      ),
    });
  }
  onSubmit(): void {
    if (this.form.valid) {
      const updatedSolicitud: Solicitudes = {
        id: this.solicitudes.id,
        fechaSolicitud: this.form.value.fechaSolicitud,
        fechaRetornoEstimada: this.form.value.fechaRetornoEstimada,
        fechaRetornoReal: this.form.value.fechaRetornoReal,
        equipo: {
          id: this.form.value.equipo,
          nombreEquipo: this.solicitudes.equipo.nombreEquipo,
          marca: this.solicitudes.equipo.marca,
          modelo: this.solicitudes.equipo.modelo,
          estadoEquipo: this.solicitudes.equipo.estadoEquipo,
          estadoUsoEquipo: this.solicitudes.equipo.estadoUsoEquipo,
          vidaUtil: this.solicitudes.equipo.vidaUtil,
          fechaAdquiscion: this.solicitudes.equipo.fechaAdquiscion,
          almacen: this.solicitudes.equipo.almacen,
        },
        obra: {
          id: this.form.value.obra,
          nombreObra: this.solicitudes.obra.nombreObra,
          ubicacionObra: this.solicitudes.obra.ubicacionObra,
          estadoObra: this.solicitudes.obra.estadoObra,
        },
        usuario: {
          id: this.form.value.usuario,
          nombreUsuario: this.solicitudes.usuario.nombreUsuario,
          apellido: this.solicitudes.usuario.apellido,
          telefono: this.solicitudes.usuario.telefono,
          correo: this.solicitudes.usuario.correo,
          password: this.solicitudes.usuario.password,
          ci: this.solicitudes.usuario.ci,
          fecha_creacion: this.solicitudes.usuario.fecha_creacion,
          activo: this.solicitudes.usuario.activo,
          obra: this.solicitudes.usuario.obra,
          imagen: this.solicitudes.usuario.imagen,
          imagen_url: this.solicitudes.usuario.imagen_url,
        },
      };

      this.solicitudesService
        .editarSolicitudes(this.solicitudes.id, updatedSolicitud)
        .subscribe({
          next: () => {
            this.mensajeModal = 'Solicitud actualizado con éxito';
            this.manejarModal = true;
          },
          error: (err) => {
            this.errorModal = 'Error al actualizar el solicitud';
            this.manejarModal = true;
          },
        });
    }
  }
  manejarOk() {
    this.manejarModal = false;
    this.listarSolicitudEditado.emit();
  }
}
