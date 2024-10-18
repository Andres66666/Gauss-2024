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
  @Output() editar = new EventEmitter<number>();
  @Output() registrarObras = new EventEmitter<number>();

  constructor(private obraServise: ObraService) {}
  ngOnInit(): void {
    this.getObras();
  }

  getObras(): void {
    this.obraServise.getObra().subscribe((data) => {
      this.obra = data;
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
    if (!this.searchTerm) {
      return this.obra;
    }
    return this.obra.filter(
      (obra) =>
        obra.nombreObra.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        obra.ubicacionObra.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  toggleObraActivo(obra: Obra) {
    // Invertir el estado de 'activo' de la obra
    obra.estadoObra = !obra.estadoObra;

    // Llamar a un servicio que actualice el estado de la obra en el servidor
    this.obraServise
      .editarObra(obra.id, { ...obra, estadoObra: obra.estadoObra })
      .subscribe(
        (response) => {
          console.log(`Obra ${obra.nombreObra} actualizada exitosamente.`);
        },
        (error) => {
          console.error('Error al actualizar el estado de la obra:', error);
        }
      );
  }
}
