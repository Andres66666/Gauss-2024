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
import { AuthService } from '../../../services/auth.service';
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
  ubicacionObra: string = '';

  manejarModal: boolean = false;
  mensajeModal: string = '';
  errorModal: string = '';
  @Output() listarSolicitud = new EventEmitter<void>();

  constructor(
    private fb: FormBuilder,
    private solicitudesService: SolicitudesService,
    private authService: AuthService
  ) {
    this.registrarForm = this.fb.group({
      fechaSolicitud: ['', Validators.required],
      fechaRetornoEstimada: ['', Validators.required],

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
  onEquipoChange(event: Event) {
    const selectElement = event.target as HTMLSelectElement; // Aserción de tipo
    const equipoId = Number(selectElement.value); // Convertir a número

    const equipoSeleccionado = this.equipos.find(
      (equipo) => equipo.id === equipoId
    );

    if (equipoSeleccionado) {
      const almacenId = equipoSeleccionado.almacen.id; // Asegúrate de que esto sea correcto
      const obraId = equipoSeleccionado.almacen.obra.id; // Asegúrate de que esto sea correcto

      // Actualizar el formulario
      this.registrarForm.patchValue({
        obra: obraId,
      });

      // Obtener la obra seleccionada para actualizar la ubicación
      const obraSeleccionada = this.obras.find((obra) => obra.id === obraId);
      if (obraSeleccionada) {
        this.ubicacionObra = obraSeleccionada.ubicacionObra; // Actualizar la ubicación de la obra
      } else {
        this.ubicacionObra = ''; // Limpiar la ubicación si no hay obra seleccionada
      }
    }
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
