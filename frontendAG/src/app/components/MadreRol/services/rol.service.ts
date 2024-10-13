import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Rol } from '../models/rol';

@Injectable({
  providedIn: 'root',
})
export class RolService {
  private apiUrl = 'http://localhost:8000/api/'; // URL del backend de Django
  constructor(private http: HttpClient) {}

  // Obtener todos los roles
  getRoles(): Observable<Rol[]> {
    return this.http.get<Rol[]>(`${this.apiUrl}rol/`);
  }
  // Obtener un rol por ID
  getRolById(id: number): Observable<Rol> {
    return this.http.get<Rol>(`${this.apiUrl}rol/${id}/`);
  }

  registrarRol(rol: Rol): Observable<Rol> {
    return this.http.post<Rol>(`${this.apiUrl}rol/`, rol);
  }
  editarRol(id: number, rol: Rol): Observable<Rol> {
    return this.http.put<Rol>(`${this.apiUrl}rol/${id}/`, rol);
  }
}
