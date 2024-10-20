import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Obra } from '../models/obra';
import { ObraService } from '../service/obra.service';
@Component({
  selector: 'app-listar-obra',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, ReactiveFormsModule],
  templateUrl: './listar-obra.component.html',
  styleUrl: './listar-obra.component.css',
})
export class ListarObraComponent implements OnInit {
  obra: Obra[] = [];

  searchTerm: string = '';

  // Variables de paginación
  page: number = 1;
  pageSize: number = 10;
  paginatedObra: Obra[] = [];

  manejarModal: boolean = false;
  mensajeModal: string = '';
  errorModal: string = '';

  @Output() editar = new EventEmitter<number>();
  @Output() registrarObras = new EventEmitter<number>();

  constructor(private obraServise: ObraService) {}
  ngOnInit(): void {
    this.getObras();
  }

  getObras(): void {
    this.obraServise.getObra().subscribe((data) => {
      this.obra = data;
      this.updatePaginatedObras();
      console.log(data);
    });
  }
  editarObra(id: number) {
    this.editar.emit(id);
  }
  registrarObra() {
    this.registrarObras.emit(); // Emit an event to register a new user
  }
  filteredObra(): Obra[] {
    let filtered = this.obra;
    if (this.searchTerm) {
      filtered = this.obra.filter(
        (obra) =>
          obra.nombreObra
            .toLowerCase()
            .includes(this.searchTerm.toLowerCase()) ||
          obra.ubicacionObra
            .toLowerCase()
            .includes(this.searchTerm.toLowerCase())
      );
    }
    return filtered.slice(
      (this.page - 1) * this.pageSize,
      this.page * this.pageSize
    );
  }

  // Métodos de paginación
  updatePaginatedObras() {
    const start = (this.page - 1) * this.pageSize;
    const end = start + this.pageSize;
    this.paginatedObra = this.obra.slice(start, end);
  }

  nextPage() {
    this.page++;
    this.updatePaginatedObras();
  }

  previousPage() {
    if (this.page > 1) {
      this.page--;
      this.updatePaginatedObras();
    }
  }
  toggleObraActivo(obra: Obra) {
    const ahora = new Date();

    // Si la obra está activa, desactivarla
    if (obra.estadoObra) {
      obra.estadoObra = false;
      obra.fecha_desactivacion = ahora; // Guardar la fecha de desactivación
      obra.fecha_cierre_obra = this.formatDateForDatabase(ahora); // Fecha de cierre
      this.mensajeModal =
        'Obra concluida. Tienes 24 horas para rectificar si cometiste un error: NOTA: pasodo las 24 hora ya no podra volver rectivar la obra';
    } else {
      // La obra está inactiva, verificar si ha pasado menos de 24 horas
      if (obra.fecha_desactivacion) {
        const diferenciaHoras =
          (ahora.getTime() - new Date(obra.fecha_desactivacion).getTime()) /
          (1000 * 60 * 60);
        if (diferenciaHoras <= 24) {
          // Se puede volver a activar
          obra.estadoObra = true;
          obra.fecha_cierre_obra = undefined; // Reiniciar la fecha de cierre
          obra.fecha_desactivacion = undefined; // Reiniciar la fecha de desactivación
          this.mensajeModal = 'Obra retomada.';
        } else {
          // No se puede volver a activar
          alert(
            'No se puede volver a activar la obra después de 24 horas de haber sido desactivada.'
          );
          return;
        }
      } else {
        // La obra no tiene fecha de desactivación, se puede activar
        obra.estadoObra = true;
        obra.fecha_cierre_obra = undefined; // Reiniciar la fecha de cierre
        obra.fecha_desactivacion = undefined; // Reiniciar la fecha de desactivación
        this.mensajeModal = 'Obra retomada.';
      }
    }

    // Mostrar en consola los datos que se están enviando
    console.log('Datos a enviar:', {
      ...obra,
      fecha_cierre_obra: obra.fecha_cierre_obra,
    });

    // Llamada al servicio para editar la obra
    this.obraServise
      .editarObra(obra.id, {
        ...obra,
        fecha_cierre_obra: obra.fecha_cierre_obra,
      })
      .subscribe(
        (response) => {
          console.log(
            `Obra ${obra.nombreObra} actualizada exitosamente.`,
            response
          );
          this.manejarModal = true; // Mostrar el modal
        },
        (error) => {
          console.error('Error al actualizar el estado de la obra:', error);
          this.errorModal = 'Error al actualizar la obra.';
          this.manejarModal = true; // Mostrar el modal de error
        }
      );
  }

  // Función para formatear la fecha en el formato "YYYY-MM-DD"
  private formatDateForDatabase(date: Date): string {
    const pad = (num: number) => num.toString().padStart(2, '0');
    const year = date.getFullYear();
    const month = pad(date.getMonth() + 1);
    const day = pad(date.getDate());

    // Formato final: "YYYY-MM-DD"
    return `${year}-${month}-${day}`;
  }

  manejarOk() {
    this.manejarModal = false; // Cerrar el modal
  }
}
