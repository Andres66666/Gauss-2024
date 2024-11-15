import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Equipo } from '../models/equipos';
import { EquiposService } from '../service/equipos.service';
@Component({
  selector: 'app-listar-equipos',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, FormsModule],
  templateUrl: './listar-equipos.component.html',
  styleUrl: './listar-equipos.component.css',
})
export class ListarEquiposComponent implements OnInit {
  equipos: Equipo[] = [];
  searchNombre: string = ''; // Nuevo campo para el nombre
  searchModelo: string = ''; // Nuevo campo para el modelo
  searchMarca: string = ''; // Nuevo campo para la marca

  page: number = 1;
  pageSize: number = 6; // cantidad items
  paginatedEquipo: Equipo[] = [];
  // CAMBIO PAG
  totalPages: number = 1;

  @Output() editar = new EventEmitter<number>();
  @Output() registrarEquipo = new EventEmitter<number>();

  constructor(private equiposService: EquiposService) {}
  ngOnInit(): void {
    this.getEquipo();
  }
  getEquipo() {
    this.equiposService.getEquipo().subscribe((data) => {
      console.log(data); // Verifica que los datos del almacen estén llegando correctamente
      this.equipos = data;
      this.updatePaginatedEquipo();
    });
  }

  editarEquipo(id: number) {
    this.editar.emit(id);
  }
  registrarEquipos() {
    this.registrarEquipo.emit();
  }
  filteredEquipo(): Equipo[] {
    let filtered = this.equipos;

    // Filtrado basado en los tres campos
    if (this.searchNombre) {
      filtered = filtered.filter((equipo) =>
        equipo.nombreEquipo
          .toLowerCase()
          .includes(this.searchNombre.toLowerCase())
      );
    }
    if (this.searchModelo) {
      filtered = filtered.filter((equipo) =>
        equipo.modelo.toLowerCase().includes(this.searchModelo.toLowerCase())
      );
    }
    if (this.searchMarca) {
      filtered = filtered.filter((equipo) =>
        equipo.marca.toLowerCase().includes(this.searchMarca.toLowerCase())
      );
    }
    // CAMBIO PAG
    // Calcula y actualiza totalPages en función del número de elementos filtrados
    this.totalPages = Math.ceil(filtered.length / this.pageSize);

    // Muestra solo los elementos de la página actual
    return filtered.slice(
      (this.page - 1) * this.pageSize,
      this.page * this.pageSize
    );
  }
  // CAMBIO PAG
  updatePaginatedEquipo() {
    this.paginatedEquipo = this.filteredEquipo();
  }
  // CAMBIO PAG
  nextPage() {
    if (this.page < this.totalPages) {
      this.page++;
      this.updatePaginatedEquipo();
    }
  }

  previousPage() {
    if (this.page > 1) {
      this.page--;
      this.updatePaginatedEquipo();
    }
  }

  getColorByEstado(estado: string): string {
    switch (estado) {
      case 'Disponible':
        return 'bg-success-light';
      case 'En uso':
        return 'bg-danger-light';
      case 'En mantenimiento':
        return 'bg-warning-light';
      default:
        return '';
    }
  }
}
