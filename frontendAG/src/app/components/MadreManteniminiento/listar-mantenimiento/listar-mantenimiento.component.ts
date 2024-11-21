import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MantenimientoService } from '../service/mantenimiento.service';
import { Almacen, Equipo, Mantenimiento, Obra } from '../models/mantenimiento';

@Component({
  selector: 'app-listar-mantenimiento',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, FormsModule],
  templateUrl: './listar-mantenimiento.component.html',
  styleUrl: './listar-mantenimiento.component.css',
})
export class ListarMantenimientoComponent implements OnInit {
  mantenimientos: Mantenimiento[] = [];
  searchTerm: string = '';

  @Output() editar = new EventEmitter<number>();
  @Output() registrarMantenimiento = new EventEmitter<number>();

  constructor(private mantenimientoService: MantenimientoService) {}

  ngOnInit(): void {
    this.getMantenimientos();
  }

  getMantenimientos(): void {
    this.mantenimientoService.getMantenimientos().subscribe((data) => {
      console.log(data); // Verifica que los datos del almacen estén llegando correctamente
      this.mantenimientos = data;
    });
  }

  editarMantenimiento(id: number) {
    this.editar.emit(id); // Emit the ID of the user to be edited
  }
  registrarMantenimientos() {
    this.registrarMantenimiento.emit(); // Emit an event to register a new user
  }

  filteredMantenimiento(): Mantenimiento[] {
    if (!this.searchTerm) {
      return this.mantenimientos;
    }
    return this.mantenimientos.filter(
      (mantenimiento) =>
        mantenimiento.equipo.nombreEquipo
          .toLowerCase()
          .includes(this.searchTerm.toLowerCase()) ||
        mantenimiento.detalleMantenimiento
          .toLowerCase()
          .includes(this.searchTerm.toLowerCase()) ||
        mantenimiento.responsable
          .toLowerCase()
          .includes(this.searchTerm.toLowerCase())
    );
  }
}
