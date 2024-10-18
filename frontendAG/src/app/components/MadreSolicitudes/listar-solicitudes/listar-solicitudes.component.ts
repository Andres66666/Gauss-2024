import { CommonModule } from '@angular/common';
import { SolicitudesService } from '../services/solicitudes.service';
import { Solicitudes } from './../models/solicitudes';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-listar-solicitudes',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, FormsModule],
  templateUrl: './listar-solicitudes.component.html',
  styleUrl: './listar-solicitudes.component.css',
})
export class ListarSolicitudesComponent implements OnInit {
  solicitudes: Solicitudes[] = [];
  searchTerm: string = '';

  @Output() editar = new EventEmitter<number>();
  @Output() registrarSolicitud = new EventEmitter<number>();

  constructor(private solicitudesService: SolicitudesService) {}

  ngOnInit(): void {
    this.getSolicitudes();
  }
  getSolicitudes(): void {
    this.solicitudesService.getSolicitudes().subscribe((data) => {
      console.log(data); // Verifica que los datos del almacen estén llegando correctamente
      this.solicitudes = data;
    });
  }
  editarSolicitudes(id: number) {
    this.editar.emit(id); // Emit the ID of the user to be edited
  }
  registrarSolicitudes() {
    this.registrarSolicitud.emit(); // Emit an event to register a new user
  }
  filteredSolicitudes(): Solicitudes[] {
    if (!this.searchTerm) {
      return this.solicitudes;
    }
    return this.solicitudes.filter((solicitudes) =>
      solicitudes.equipo.nombreEquipo
        .toLowerCase()
        .includes(this.searchTerm.toLowerCase())
    );
  }
}
