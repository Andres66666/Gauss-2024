import { CommonModule } from '@angular/common';
import { SolicitudesService } from '../services/solicitudes.service';
import { Solicitudes, Usuario, Equipo } from './../models/solicitudes';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-listar-solicitudes',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, FormsModule],
  templateUrl: './listar-solicitudes.component.html',
  styleUrls: ['./listar-solicitudes.component.css'],
})
export class ListarSolicitudesComponent implements OnInit {
  solicitudes: Solicitudes[] = [];
  usuarios: Usuario[] = [];
  equipos: Equipo[] = [];
  searchTerm: string = '';

  nombreUsuario: string = '';
  apellido: string | null = '';

  @Output() editar = new EventEmitter<number>();
  @Output() registrarSolicitud = new EventEmitter<void>(); // Cambiado a void ya que no se emite un número

  constructor(private solicitudesService: SolicitudesService) {}

  ngOnInit(): void {
    this.getSolicitudes();
    this.getUsuarios();
    this.getEquipos();
    this.setUsuario();
  }

  getSolicitudes(): void {
    this.solicitudesService.getSolicitudes().subscribe((data) => {
      console.log(data); // Verifica que los datos del almacen estén llegando correctamente
      this.solicitudes = data;
    });
  }

  getUsuarios(): void {
    this.solicitudesService.getUsuario().subscribe((data) => {
      console.log(data); // Verifica que los datos de usuarios estén llegando correctamente
      this.usuarios = data;
    });
  }

  getEquipos(): void {
    this.solicitudesService.getEquipos().subscribe((data) => {
      console.log(data); // Verifica que los datos de equipos estén llegando correctamente
      this.equipos = data;
    });
  }

  editarSolicitudes(id: number): void {
    this.editar.emit(id); // Emit the ID of the user to be edited
  }

  registrarSolicitudes(): void {
    this.registrarSolicitud.emit(); // Emit an event to register a new user
  }

  filteredSolicitudes(): Solicitudes[] {
    if (!this.searchTerm) {
      return this.solicitudes;
    }
    return this.solicitudes.filter((solicitud) =>
      solicitud.equipo.nombreEquipo
        .toLowerCase()
        .includes(this.searchTerm.toLowerCase())
    );
  }

  concretarSolicitud(solicitud: Solicitudes): void {
    const updatedSolicitud: Solicitudes = {
      ...solicitud,
      estado: 'completada',
      fecha_retorno_real: new Date().toISOString().split('T')[0], // Formato YYYY-MM-DD
      // Mantener las otras fechas sin cambios
      fecha_solicitud: solicitud.fecha_solicitud,
      fecha_retorno_estimada: solicitud.fecha_retorno_estimada,
      equipo: {
        ...solicitud.equipo,
      },
      usuario: {
        ...solicitud.usuario,
      },
    };

    console.log('Solicitud a actualizar:', updatedSolicitud); // Para depuración

    this.solicitudesService
      .updateSolicitud(solicitud.id, updatedSolicitud)
      .subscribe(
        (response) => {
          console.log('Solicitud concretada con éxito:', response);
        },
        (error) => {
          console.error('Error al concretar la solicitud:', error);
          alert('Error al concretar la solicitud: ' + JSON.stringify(error)); // Mostrar error completo
        }
      );
  }
  setUsuario() {
    try {
      const usuario = JSON.parse(localStorage.getItem('usuario') || '{}');
      if (usuario && typeof usuario === 'object') {
        this.nombreUsuario = usuario.nombreUsuario || '';
        this.apellido = usuario.apellido || '';
      }
    } catch (error) {
      console.error('Error al recuperar el usuario de localStorage', error);
    }
  }
}
