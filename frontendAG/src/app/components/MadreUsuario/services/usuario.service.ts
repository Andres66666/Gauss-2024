import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Obra, Usuario } from '../models/usuario';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class UsuarioService {
  private apiUrl = 'http://localhost:8000/api/'; // URL del backend de Django
  constructor(private http: HttpClient) {}

  // Obtener todos los usuarios
  getUsuarios(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(`${this.apiUrl}usuario/`);
  }
  // Obtener un usuario por ID
  getUserById(id: number): Observable<Usuario> {
    return this.http.get<Usuario>(`${this.apiUrl}usuario/${id}/`); // Corregido la URL para coincidir con el endpoint
  }
  // Registrar un nuevo usuario
  registrarUsuario(usuario: Usuario): Observable<Usuario> {
    return this.http.post<Usuario>(`${this.apiUrl}usuario/`, usuario);
  }

  editarUsuario(id: number, usuario: FormData): Observable<Usuario> {
    return this.http.put<Usuario>(`${this.apiUrl}usuario/${id}/`, usuario);
  }

  // Obtener todas las obras
  getObras(): Observable<Obra[]> {
    return this.http.get<Obra[]>(`${this.apiUrl}obra/`);
  }

  actualizarEstadoUsuario(id: number, activo: boolean): Observable<any> {
    return this.http.put(`${this.apiUrl}usuario/${id}/`, {
      activo: activo ? 'true' : 'false',
    });
  }

  getDepartamentos(): Observable<string[]> {
    return this.http.get<string[]>('http://localhost:8000/api/usuario');
  }

  /* esto es por si las duidas nomas  */
  getUsuarioByCI(ci: string): Observable<Usuario | null> {
    return this.getUsuarios().pipe(
      map((usuarios) => usuarios.find((usuario) => usuario.ci === ci) || null)
    );
  }
}
