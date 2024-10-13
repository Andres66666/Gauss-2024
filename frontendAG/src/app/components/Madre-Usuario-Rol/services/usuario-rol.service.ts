import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Obra, Rol, Usuario, UsuarioRol } from '../models/usuario-rol';

@Injectable({
  providedIn: 'root',
})
export class UsuarioRolService {
  private apiUrl = 'http://localhost:8000/api/'; // URL del backend de Django

  constructor(private http: HttpClient) {}

  // Obtener todas las relaciones usuario-rol
  getUsuarioRoles(): Observable<UsuarioRol[]> {
    return this.http.get<UsuarioRol[]>(`${this.apiUrl}usuario-rol/`);
  }

  // Obtener una relación usuario-rol por ID
  getUsuarioRolById(id: number): Observable<UsuarioRol> {
    return this.http.get<UsuarioRol>(`${this.apiUrl}usuario-rol/${id}/`);
  }

  // Registrar un nuevo rol-permiso
  registrarUsarioRol(usuarioRol: UsuarioRol): Observable<UsuarioRol> {
    return this.http.post<UsuarioRol>(`${this.apiUrl}usuario-rol/`, usuarioRol);
  }

  editarUsuarioRol(
    id: number,
    updatedUsuarioRol: UsuarioRol
  ): Observable<UsuarioRol> {
    return this.http.put<UsuarioRol>(
      `${this.apiUrl}usuario-rol/${id}/`,
      updatedUsuarioRol
    );
  }

  // Obtener todos los roles
  getRoles(): Observable<Rol[]> {
    return this.http.get<Rol[]>(`${this.apiUrl}rol/`);
  }

  // Obtener todos los permisos
  getUsuarios(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(`${this.apiUrl}usuario/`);
  }
  // Obtener todas las obras
  getObras(): Observable<Obra[]> {
    return this.http.get<Obra[]>(`${this.apiUrl}obra/`);
  }
}
