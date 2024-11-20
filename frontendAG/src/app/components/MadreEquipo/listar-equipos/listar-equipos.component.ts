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
  styleUrls: ['./listar-equipos.component.css'],
})
export class ListarEquiposComponent implements OnInit {
  equipos: Equipo[] = [];
  searchNombre: string = ''; // Campo para buscar por nombre
  searchModelo: string = ''; // Campo para buscar por modelo
  searchMarca: string = ''; // Campo para buscar por marca

  page: number = 1; // Página actual
  pageSize: number = 6; // Cantidad de items por página
  paginatedEquipo: Equipo[] = []; // Equipos paginados
  totalPages: number = 1; // Total de páginas

  @Output() editar = new EventEmitter<number>();
  @Output() registrarEquipo = new EventEmitter<void>();

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
        equipo.modeloEquipo
          .toLowerCase()
          .includes(this.searchModelo.toLowerCase())
      );
    }
    if (this.searchMarca) {
      filtered = filtered.filter((equipo) =>
        equipo.marcaEquipo
          .toLowerCase()
          .includes(this.searchMarca.toLowerCase())
      );
    }

    // Calcula y actualiza totalPages en función del número de elementos filtrados
    this.totalPages = Math.ceil(filtered.length / this.pageSize);

    // Muestra solo los elementos de la página actual
    return filtered.slice(
      (this.page - 1) * this.pageSize,
      this.page * this.pageSize
    );
  }

  updatePaginatedEquipo() {
    this.paginatedEquipo = this.filteredEquipo();
  }

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
