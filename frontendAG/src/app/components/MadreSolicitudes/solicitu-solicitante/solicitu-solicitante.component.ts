import { Usuario } from './../../MadreUsuario/models/usuario';
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Equipo, Solicitudes } from '../models/solicitudes';
import { SolicitudesService } from '../services/solicitudes.service';

@Component({
  selector: 'app-solicitu-solicitante',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],

  templateUrl: './solicitu-solicitante.component.html',
  styleUrl: './solicitu-solicitante.component.css',
})
export class SolicituSolicitanteComponent implements OnInit {
  solicitudForm: FormGroup;
  equipos: Equipo[] = [];
  usuarios: Usuario[] = [];

  nombreUsuario: string = '';
  apellido: string | null = '';

  filteredEquipos: Equipo[] = [];
  filteredUsuarios: Usuario[] = [];

  @Output() listarSolicitud = new EventEmitter<void>();

  constructor(
    private fb: FormBuilder,
    private solicitudesService: SolicitudesService
  ) {
    this.solicitudForm = this.fb.group({
      codigoSolicitud: ['', Validators.required],
      fecha_solicitud: ['', Validators.required],
      fecha_retorno_estimada: ['', Validators.required],
      fecha_retorno_real: [''], // Este campo puede ser opcional
      estado: ['En uso', Validators.required], // Valor por defecto
      motivo_uso: [''],
      fecha_uso: ['', Validators.required],
      equipo: ['', Validators.required],
      usuario: ['', Validators.required],
      descripcion_falla: [''],
      cantidad_fallas_solicitud: [0, [Validators.required, Validators.min(0)]],
      horas_uso_solicitud: [0, [Validators.required, Validators.min(0)]],
    });
  }

  ngOnInit(): void {
    this.loadEquipos();
    this.loadUsuarios();
    this.setUsuario();
  }

  loadEquipos() {
    this.solicitudesService.getEquipos().subscribe((data) => {
      this.equipos = data;
    });
  }

  loadUsuarios() {
    this.solicitudesService.getUsuario().subscribe((data) => {
      this.usuarios = data;
    });
  }
  buscarEquipo(event: Event) {
    const input = event.target as HTMLInputElement; // Casting a HTMLInputElement
    const codigo = input.value;

    if (codigo.trim() === '') {
      // Si el campo de búsqueda está vacío, limpiar el campo de equipo
      this.filteredEquipos = [];
      this.solicitudForm.patchValue({ equipo: '' });
      return;
    }

    this.filteredEquipos = this.equipos.filter(
      (equipo) =>
        equipo.codigoEquipo.includes(codigo) &&
        equipo.estadoDisponibilidad !== 'En uso' &&
        equipo.estadoDisponibilidad !== 'En Mantenimiento'
    );

    if (this.filteredEquipos.length === 1) {
      this.solicitudForm.patchValue({ equipo: this.filteredEquipos[0].id });
    } else if (this.filteredEquipos.length === 0) {
      alert('Equipo no disponible'); // Mostrar alerta si no hay equipos disponibles
      this.solicitudForm.patchValue({ equipo: '' }); // Limpiar el campo de equipo
    }
  }

  setUsuario() {
    try {
      const usuario = JSON.parse(localStorage.getItem('usuario') || '{}');
      if (usuario && typeof usuario === 'object') {
        this.nombreUsuario = usuario.nombreUsuario || '';
        this.apellido = usuario.apellido || '';
        // Inicializa el campo motivo_uso con el nombre y apellido del usuario
        this.solicitudForm.patchValue({
          motivo_uso: `Solicitado por: ${this.nombreUsuario} ${this.apellido}\n\nMotivo: `,
        });
      }
    } catch (error) {
      console.error('Error al recuperar el usuario de localStorage', error);
    }
  }

  buscarUsuario(event: Event) {
    const input = event.target as HTMLInputElement; // Casting a HTMLInputElement
    const ci = input.value;

    if (ci.trim() === '') {
      // Si el campo de búsqueda está vacío, limpiar el campo de usuario
      this.filteredUsuarios = [];
      this.solicitudForm.patchValue({ usuario: '' });
      return;
    }

    this.filteredUsuarios = this.usuarios.filter((usuario) =>
      usuario.ci.includes(ci)
    );

    if (this.filteredUsuarios.length === 0) {
      this.solicitudForm.patchValue({ usuario: '' }); // Limpiar el campo de usuario si no hay resultados
    } else if (this.filteredUsuarios.length === 1) {
      this.solicitudForm.patchValue({ usuario: this.filteredUsuarios[0].id });
    }
  }

  onSubmit() {
    if (this.solicitudForm.valid) {
      const nuevaSolicitud: Solicitudes = this.solicitudForm.value;

      // Si fecha_retorno_real está vacío, establecerlo como null
      if (!nuevaSolicitud.fecha_retorno_real) {
        nuevaSolicitud.fecha_retorno_real = null;
      }
      // Agregar el nombre y apellido al motivo de uso
      nuevaSolicitud.motivo_uso = `Solicitado por: ${this.nombreUsuario} ${this.apellido}\n\nMotivo: ${nuevaSolicitud.motivo_uso}`;

      console.log('Datos a enviar:', nuevaSolicitud); // Verifica aquí
      this.solicitudesService.createSolicitudes(nuevaSolicitud).subscribe(
        (response) => {
          console.log('Solicitud registrada con éxito:', response);
          this.listarSolicitud.emit();
          this.solicitudForm.reset();
        },
        (error) => {
          console.error('Error al registrar la solicitud:', error);
          // Manejar el error si el equipo no está disponible
          if (error.status === 400) {
            alert(error.error.error); // Mostrar el mensaje de error
          } else {
            console.error('Error al registrar la solicitud:', error);
          }
        }
      );
    } else {
      console.log('Formulario inválido');
    }
  }

  manejarOk() {
    this.listarSolicitud.emit(); // Emitir el evento para listar solicitudes
  }
}
