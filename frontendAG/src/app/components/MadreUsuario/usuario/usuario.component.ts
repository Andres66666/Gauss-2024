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

  searchnombreUsuario: string = ''; // Nuevo campo para el nombre
  searchapellido: string = ''; // Nuevo campo para el modelo
  searchcorreo: string = ''; // Nuevo campo para el modelo
  searchci: string = ''; // Nuevo campo para la marca
  searchdepartamento: string = ''; // Nuevo campo para la marca

  page: number = 1;
  pageSize: number = 6;
  paginatedUsuario: Usuario[] = [];

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
      this.updatePaginatedUsuario();
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
    let filtered = this.usuarios;

    // Filtrado basado en los tres campos
    if (this.searchnombreUsuario) {
      filtered = filtered.filter((usuario) =>
        usuario.nombreUsuario
          .toLowerCase()
          .includes(this.searchnombreUsuario.toLowerCase())
      );
    }
    if (this.searchapellido) {
      filtered = filtered.filter((usuario) =>
        usuario.apellido
          .toLowerCase()
          .includes(this.searchapellido.toLowerCase())
      );
    }
    if (this.searchcorreo) {
      filtered = filtered.filter((usuario) =>
        usuario.correo?.toLowerCase().includes(this.searchcorreo.toLowerCase())
      );
    }
    if (this.searchci) {
      filtered = filtered.filter((usuario) =>
        usuario.ci.toLowerCase().includes(this.searchci.toLowerCase())
      );
    }
    if (this.searchdepartamento) {
      filtered = filtered.filter((usuario) =>
        usuario.departamento
          .toLowerCase()
          .includes(this.searchdepartamento.toLowerCase())
      );
    }

    return filtered.slice(
      (this.page - 1) * this.pageSize,
      this.page * this.pageSize
    ); // Mostramos solo la página actual
  }
  // Métodos de paginación
  updatePaginatedUsuario() {
    const start = (this.page - 1) * this.pageSize;
    const end = start + this.pageSize;
    this.paginatedUsuario = this.usuarios.slice(start, end);
  }

  nextPage() {
    this.page++;
    this.updatePaginatedUsuario();
  }

  previousPage() {
    if (this.page > 1) {
      this.page--;
      this.updatePaginatedUsuario();
    }
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
  // Nueva función para obtener el nombre de la obra
  getNombreObra(usuario: Usuario): string {
    return usuario.obra && usuario.obra.nombreObra
      ? usuario.obra.nombreObra
      : 'Sin asignar';
  }
}
