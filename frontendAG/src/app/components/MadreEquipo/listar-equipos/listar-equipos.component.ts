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
  searchTerm: string = '';

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
    });
  }

  editarEquipo(id: number) {
    this.editar.emit(id);
  }
  registrarEquipos() {
    this.registrarEquipo.emit();
  }
  filteredEquipo(): Equipo[] {
    if (!this.searchTerm) {
      return this.equipos; // Return all users if no search term is provided
    }

    return this.equipos.filter((equipo) =>
      equipo.nombreEquipo.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }
}
