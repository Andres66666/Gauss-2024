import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Almacen, Obra } from '../models/almacen';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AlmacenService {
  private apiUrl = 'http://localhost:8000/api/'; // URL del backend de Django
  constructor(private http: HttpClient) {}
  // Obtener todos los usuarios
  getAlmacen(): Observable<Almacen[]> {
    return this.http.get<Almacen[]>(`${this.apiUrl}almacen/`);
  }
  // Obtener un usuario por ID
  getAlmacenById(id: number): Observable<Almacen> {
    return this.http.get<Almacen>(`${this.apiUrl}almacen/${id}/`); // Corregido la URL para coincidir con el endpoint
  }
  // UsuarioService
  registrarAlmacen(almacen: Almacen): Observable<Almacen> {
    return this.http.post<Almacen>(`${this.apiUrl}almacen/`, almacen);
  }
  editarAlmacen(id: number, almacen: Almacen): Observable<Almacen> {
    return this.http.put<Almacen>(`${this.apiUrl}almacen/${id}/`, almacen);
  }

  // Obtener todas las obras
  getObras(): Observable<Obra[]> {
    return this.http.get<Obra[]>(`${this.apiUrl}obra/`);
  }
}
