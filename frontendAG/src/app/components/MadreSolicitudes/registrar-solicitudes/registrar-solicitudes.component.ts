import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
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
  Obra,
  Solicitudes,
  Usuario,
} from '../models/solicitudes';
import { SolicitudesService } from '../services/solicitudes.service';

@Component({
  selector: 'app-registrar-solicitudes',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './registrar-solicitudes.component.html',
  styleUrl: './registrar-solicitudes.component.css',
})
export class RegistrarSolicitudesComponent implements OnInit {
  registrarForm: FormGroup;
  equipos: Equipo[] = [];
  almacenes: Almacen[] = [];
  obras: Obra[] = [];
  usuarios: Usuario[] = [];

  manejarModal: boolean = false;
  mensajeModal: string = '';
  errorModal: string = '';
  @Output() listarSolicitud = new EventEmitter<void>();

  constructor(
    private fb: FormBuilder,
    private solicitudesService: SolicitudesService
  ) {
    this.registrarForm = this.fb.group({
      fechaSolicitud: ['', Validators.required],
      fechaRetornoEstimada: ['', Validators.required],
      fechaRetornoReal: ['', Validators.required],
      equipo: ['', Validators.required],
      obra: ['', Validators.required],
      usuario: ['', Validators.required],
    });
  }
  ngOnInit(): void {
    this.loadEquipos();
    this.loadAlmacenes();
    this.loadObras();
    this.loadUsuario();
  }

  loadEquipos() {
    this.solicitudesService.getEquipos().subscribe((data) => {
      this.equipos = data;
    });
  }

  loadAlmacenes() {
    this.solicitudesService.getAlmacenes().subscribe((data) => {
      this.almacenes = data;
    });
  }

  loadObras() {
    this.solicitudesService.getObras().subscribe((data) => {
      this.obras = data;
    });
  }

  loadUsuario() {
    this.solicitudesService.getUsuario().subscribe((data) => {
      this.usuarios = data;
    });
  }

  registrarSolicitudes() {
    if (this.registrarForm.valid) {
      const nuevoSolicitudes: Solicitudes = {
        ...this.registrarForm.value,
      };

      this.solicitudesService.createSolicitudes(nuevoSolicitudes).subscribe(
        (response) => {
          this.mensajeModal = 'Solicitud registrado exitosamente';
          this.manejarModal = true;
        },
        (error) => {
          this.errorModal = 'Error al registrar el solicitud';
          this.manejarModal = true;
        }
      );
    }
  }
  manejarOk() {
    this.manejarModal = false; // Cerrar el modal
    this.listarSolicitud.emit(); // Emitir el evento para listar usuarios
  }
}
