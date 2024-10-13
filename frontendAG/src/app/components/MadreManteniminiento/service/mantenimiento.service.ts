import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Almacen, Equipo, Mantenimiento, Obra } from '../models/mantenimiento';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MantenimientoService {
  private apiUrl = 'http://localhost:8000/api/'; // URL del backend de Django
  constructor(private http: HttpClient) {}

  // Obtener todos los mantenimientos
  getMantenimientos(): Observable<Mantenimiento[]> {
    return this.http.get<Mantenimiento[]>(`${this.apiUrl}mantenimiento/`);
  }

  // Obtener un mantenimiento específico por ID
  getMantenimientoById(id: number): Observable<Mantenimiento> {
    return this.http.get<Mantenimiento>(`${this.apiUrl}mantenimiento/${id}/`);
  }

  // Crear un nuevo mantenimiento
  createMantenimiento(mantenimiento: Mantenimiento): Observable<Mantenimiento> {
    return this.http.post<Mantenimiento>(
      `${this.apiUrl}mantenimiento/`,
      mantenimiento
    );
  }
  editarMantenimiento(
    id: number,
    mantenimiento: Mantenimiento
  ): Observable<Mantenimiento> {
    return this.http.put<Mantenimiento>(
      `${this.apiUrl}mantenimiento/${id}/`,
      mantenimiento
    );
  }

  // Obtener todos los equipos
  getEquipos(): Observable<Equipo[]> {
    return this.http.get<Equipo[]>(`${this.apiUrl}equipo/`);
  }

  // Obtener todos los almacenes
  getAlmacenes(): Observable<Almacen[]> {
    return this.http.get<Almacen[]>(`${this.apiUrl}almacen/`);
  }

  // Obtener todas las obras
  getObras(): Observable<Obra[]> {
    return this.http.get<Obra[]>(`${this.apiUrl}obra/`);
  }
}
