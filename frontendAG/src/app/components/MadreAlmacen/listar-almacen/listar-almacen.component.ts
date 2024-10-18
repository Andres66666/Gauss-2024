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

  @Output() editar = new EventEmitter<number>();
  @Output() registrarAlmacen = new EventEmitter<number>(); // Emit an event when editing

  searchTerm: string = ''; // Property for storing the search term

  constructor(private almacenService: AlmacenService) {}

  ngOnInit(): void {
    this.getAlmacen();
  }
  getAlmacen() {
    this.almacenService.getAlmacen().subscribe((data) => {
      this.almacenes = data;
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
    if (!this.searchTerm) {
      return this.almacenes; // Return all users if no search term is provided
    }
    return this.almacenes.filter((almacen) =>
      almacen.nombreAlmacen
        .toLowerCase()
        .includes(this.searchTerm.toLowerCase())
    ); // Filter users based on the search term
  }
}
