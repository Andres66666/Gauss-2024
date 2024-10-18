import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { UsuarioService } from '../services/usuario.service';
import { Usuario } from '../models/usuario';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-usuario',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, FormsModule],
  templateUrl: './usuario.component.html',
  styleUrls: ['./usuario.component.css'],
})
export class UsuarioComponent implements OnInit {
  usuarios: Usuario[] = [];

  @Output() editar = new EventEmitter<number>(); // Emit an event when editing
  @Output() registrar = new EventEmitter<number>(); // Emit an event when editing

  searchTerm: string = ''; // Property for storing the search term

  constructor(private usuarioService: UsuarioService, private router: Router) {}

  ngOnInit(): void {
    this.getUsuarios();
  }

  getUsuarios() {
    this.usuarioService.getUsuarios().subscribe((data) => {
      this.usuarios = data;
      this.ordenarUsuariosPorId();
      console.log(data);
    });
  }

  editarUsuario(id: number) {
    this.editar.emit(id); // Emit the ID of the user to be edited
    this.getUsuarios(); // Volver a obtener la lista después de editar
  }
  registrarUsuario() {
    this.registrar.emit(); // Emit an event to register a new user
  }

  filteredUsuarios(): Usuario[] {
    if (!this.searchTerm) {
      return this.usuarios; // Return all users if no search term is provided
    }

    return this.usuarios.filter((usuario) =>
      usuario.nombreUsuario
        .toLowerCase()
        .includes(this.searchTerm.toLowerCase())
    ); // Filter users based on the search term
  }
  toggleUsuarioActivo(usuario: any) {
    // Invertir el estado de 'activo' del usuario
    usuario.activo = !usuario.activo;

    // Llamar a un servicio que actualice el estado del usuario en el servidor
    this.usuarioService
      .actualizarEstadoUsuario(usuario.id, usuario.activo)
      .subscribe(
        (response) => {
          console.log(
            `Usuario ${usuario.nombreUsuario} actualizado exitosamente.`
          );
        },
        (error) => {
          console.error('Error al actualizar el estado del usuario:', error);
        }
      );
  }
  ordenarUsuariosPorId() {
    this.usuarios.sort((a, b) => a.id - b.id); // Ordenar por ID en orden ascendente
  }
}
