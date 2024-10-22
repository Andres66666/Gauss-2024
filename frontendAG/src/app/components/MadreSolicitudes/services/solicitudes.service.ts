import { Injectable } from '@angular/core';
import {
  Almacen,
  Equipo,
  Obra,
  Solicitudes,
  Usuario,
} from '../models/solicitudes';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class SolicitudesService {
  private apiUrl = 'http://localhost:8000/api/'; // URL del backend de Django
  constructor(private http: HttpClient) {}

  // Obtener todos los mantenimientos
  getSolicitudes(): Observable<Solicitudes[]> {
    return this.http.get<Solicitudes[]>(`${this.apiUrl}solicitud/`);
  }

  // Obtener un mantenimiento específico por ID
  getSolicitudesById(id: number): Observable<Solicitudes> {
    return this.http.get<Solicitudes>(`${this.apiUrl}solicitud/${id}/`);
  }

  // Crear un nuevo mantenimiento
  createSolicitudes(solicitudes: Solicitudes): Observable<Solicitudes> {
    return this.http.post<Solicitudes>(`${this.apiUrl}solicitud/`, solicitudes);
  }
  
  editarSolicitudes(
    id: number,
    solicitudes: Solicitudes
  ): Observable<Solicitudes> {
    return this.http.put<Solicitudes>(
      `${this.apiUrl}solicitud/${id}/`,
      solicitudes
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
  getUsuario(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(`${this.apiUrl}usuario/`);
  }
}
