import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { RolService } from '../services/rol.service';
import { Rol } from '../models/rol';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-rol',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, FormsModule],
  templateUrl: './rol.component.html',
  styleUrl: './rol.component.css',
})
export class RolComponent {
  roles: Rol[] = [];
  @Output() editar = new EventEmitter<number>(); 
  @Output() registrar_Rol = new EventEmitter<number>(); 

  searchTerm: string = ''; // Property for storing the search term

  constructor(private rolService: RolService, private router: Router) {}

  ngOnInit(): void {
    this.getRoles();
  }

  getRoles() {
    this.rolService.getRoles().subscribe((data) => {
      this.roles = data;
      console.log(data);
    });
  }
  editarRol(id: number) {
    this.editar.emit(id);
  }
  registrarRol() {
    this.registrar_Rol.emit(); // Emit an event to register a new user
  }

  filteredRol(): Rol[] {
    if (!this.searchTerm) {
      return this.roles;
    }
    return this.roles.filter((rol) =>
      rol.nombreRol.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }
  toggleRolActivo(rol: Rol) {
    // Invertir el estado de 'activo' del rol
    rol.activo = !rol.activo;

    // Llamar a un servicio que actualice el estado del rol en el servidor
    this.rolService.editarRol(rol.id, { ...rol, activo: rol.activo }).subscribe(
      (response) => {
        console.log(`Rol ${rol.nombreRol} actualizado exitosamente.`);
      },
      (error) => {
        console.error('Error al actualizar el estado del rol:', error);
      }
    );
  }
}
