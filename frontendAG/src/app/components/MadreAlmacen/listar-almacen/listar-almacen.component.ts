import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AlmacenService } from '../service/almacen.service';
import { Almacen } from '../models/almacen';
@Component({
  selector: 'app-listar-almacen',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, FormsModule],
  templateUrl: './listar-almacen.component.html',
  styleUrl: './listar-almacen.component.css',
})
export class ListarAlmacenComponent implements OnInit {
  almacenes: Almacen[] = [];
  searchTerm: string = '';

  page: number = 1;
  pageSize: number = 5;
  paginateAlmacen: Almacen[] = [];

  @Output() editar = new EventEmitter<number>();
  @Output() registrarAlmacen = new EventEmitter<number>(); // Emit an event when editing

  constructor(private almacenService: AlmacenService) {}

  ngOnInit(): void {
    this.getAlmacen();
  }
  getAlmacen() {
    this.almacenService.getAlmacen().subscribe((data) => {
      this.almacenes = data;
      this.updatePaginatedAlmacenes();
      console.log(data);
    });
  }
  editarAlmacen(id: number) {
    this.editar.emit(id); // Emit the ID of the user to be edited
  }
  registrarAlmacenes() {
    this.registrarAlmacen.emit();
  }
  filteredAlmacen(): Almacen[] {
    let filtered = this.almacenes;
    if (this.searchTerm) {
      filtered = this.almacenes.filter(
        (almacen) =>
          almacen.nombreAlmacen
            .toLowerCase()
            .includes(this.searchTerm.toLowerCase()) ||
          almacen.obra.nombreObra
            .toLowerCase()
            .includes(this.searchTerm.toLowerCase())
      );
    }
    return filtered.slice(
      (this.page - 1) * this.pageSize,
      this.page * this.pageSize
    ); // Mostramos solo la página actual
  }
  // Métodos de paginación
  updatePaginatedAlmacenes() {
    const start = (this.page - 1) * this.pageSize;
    const end = start + this.pageSize;
    this.paginateAlmacen = this.almacenes.slice(start, end);
  }
  nextPage() {
    this.page++;
    this.updatePaginatedAlmacenes();
  }

  previousPage() {
    if (this.page > 1) {
      this.page--;
      this.updatePaginatedAlmacenes();
    }
  }

  togglePermisoActivo(almacen: Almacen) {
    // Invertir el estado de 'activo' del permiso
    almacen.estadoAlmacen = !almacen.estadoAlmacen;

    // Llamar a un servicio que actualice el estado del permiso en el servidor
    this.almacenService
      .editarAlmacen(almacen.id, {
        ...almacen,
        estadoAlmacen: almacen.estadoAlmacen,
      })
      .subscribe(
        (response) => {
          console.log(
            `Almacen ${almacen.nombreAlmacen} actualizado exitosamente.`
          );
        },
        (error) => {
          console.error('Error al actualizar el estado del almacen:', error);
        }
      );
  }
}
