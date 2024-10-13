import { Usuario } from './../../MadreUsuario/models/usuario';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { UsuarioRol } from '../models/usuario-rol';
import { UsuarioRolService } from '../services/usuario-rol.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-usuario-rol',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './usuario-rol.component.html',
  styleUrl: './usuario-rol.component.css',
})
export class UsuarioRolComponent implements OnInit {
  usuarioRoles: UsuarioRol[] = [];
  
  @Output() editar = new EventEmitter<number>(); // Emit an event when editing
  searchTerm: string = ''; // Property for storing the search term

  constructor(private usuarioRolService: UsuarioRolService) {}

  ngOnInit(): void {
    this.getUsuarioRoles();
  }

  getUsuarioRoles() {
    this.usuarioRolService.getUsuarioRoles().subscribe((data) => {
      this.usuarioRoles = data;
      console.log(data);
    });
  }
  filteredRolPermiso(): UsuarioRol[] {
    if (!this.searchTerm) {
      return this.usuarioRoles;
    }
    return this.usuarioRoles.filter((usuarioRol) =>
      usuarioRol.usuario.nombreUsuario
        .toLowerCase()
        .includes(this.searchTerm.toLowerCase())
    );
  }
  editarRolPermiso(id: number) {
    this.editar.emit(id);
  }
}
