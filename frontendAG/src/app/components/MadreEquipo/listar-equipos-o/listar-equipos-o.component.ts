import { Component } from '@angular/core';
import { Equipo } from '../models/equipos';
import { EquiposService } from '../service/equipos.service';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-listar-equipos-o',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './listar-equipos-o.component.html',
  styleUrl: './listar-equipos-o.component.css',
})
export class ListarEquiposOComponent {
  equipos: Equipo[] = [];
  searchNombre: string = ''; // Nuevo campo para el nombre
  searchModelo: string = ''; // Nuevo campo para el modelo
  searchMarca: string = ''; // Nuevo campo para la marca

  page: number = 1;
  pageSize: number = 6;
  paginatedEquipo: Equipo[] = [];

  constructor(private equiposService: EquiposService) {}
  ngOnInit(): void {
    this.getEquipo();
  }
  getEquipo() {
    this.equiposService.getEquipo().subscribe((data) => {
      console.log(data); // Verifica que los datos del almacen estén llegando correctamente
      this.updatePaginatedEquipo();
      this.equipos = data;
    });
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

    return filtered.slice(
      (this.page - 1) * this.pageSize,
      this.page * this.pageSize
    ); // Mostramos solo la página actual
  }

  // Métodos de paginación
  updatePaginatedEquipo() {
    const start = (this.page - 1) * this.pageSize;
    const end = start + this.pageSize;
    this.paginatedEquipo = this.equipos.slice(start, end);
  }

  nextPage() {
    this.page++;
    this.updatePaginatedEquipo();
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
        return 'bg-success-light'; // Verde claro
      case 'En uso':
        return 'bg-danger-light'; // Rojo claro
      case 'En mantenimiento':
        return 'bg-warning-light'; // Amarillo claro
      default:
        return '';
    }
  }
}
