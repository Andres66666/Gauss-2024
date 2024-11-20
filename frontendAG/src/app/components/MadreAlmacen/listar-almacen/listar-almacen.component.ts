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
  // Variables de paginación
  page: number = 1;
  pageSize: number = 10;

  @Output() editarAlmacenes = new EventEmitter<number>(); // Emit an event when editing
  @Output() registrarAlmacen = new EventEmitter<void>(); // Emit an event when registering

  constructor(private almacenService: AlmacenService) {}

  ngOnInit(): void {
    this.getAlmacenes();
  }

  getAlmacenes(): void {
    this.almacenService.getAlmacen().subscribe((data) => {
      this.almacenes = data;
      console.log('Almacenes:', this.almacenes); // Verifica que los datos se reciban correctamente
    });
  }

  editarAlmacen(id: number) {
    this.editarAlmacenes.emit(id);
  }

  registrarAlmacenes() {
    this.registrarAlmacen.emit(); // Emit an event to register a new almacen
  }

  // Método para filtrar y paginar resultados
  filteredAlmacenes(): Almacen[] {
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
    );
  }

  // Método para actualizar la paginación
  nextPage() {
    this.page++;
  }

  previousPage() {
    if (this.page > 1) {
      this.page--;
    }
  }

  toggleAlmacenActivo(almacen: Almacen) {
    // Invertir el estado de 'activo' del almacen
    const nuevoEstado = !almacen.estadoAlmacen;

    // Llamar a un servicio que actualice el estado del almacen en el servidor
    this.almacenService
      .editarAlmacen(almacen.id, {
        ...almacen,
        estadoAlmacen: nuevoEstado,
      })
      .subscribe(
        (response) => {
          console.log(
            `Almacen ${almacen.nombreAlmacen} actualizado exitosamente.`,
            response
          );
          // Actualizar el estado local del almacen
          almacen.estadoAlmacen = nuevoEstado;
        },
        (error) => {
          console.error('Error al actualizar el estado del almacen:', error);
          // Aquí podrías mostrar un mensaje al usuario si es necesario
        }
      );
  }
}
