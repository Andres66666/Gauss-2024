import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Almacen, Equipo, Obra } from '../models/equipos';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EquiposService {
  private apiUrl = 'http://localhost:8000/api/'; // URL del backend de Django
  constructor(private http: HttpClient) {}

  getEquipo(): Observable<Equipo[]> {
    return this.http.get<Equipo[]>(`${this.apiUrl}equipo/`);
  }
  getEquipoById(id: number): Observable<Equipo> {
    return this.http.get<Equipo>(`${this.apiUrl}equipo/${id}/`); // Corregido la URL para coincidir con el endpoint
  }
  // UsuarioService
  registrarEquipos(equipo: Equipo): Observable<Equipo> {
    return this.http.post<Equipo>(`${this.apiUrl}equipo/`, equipo);
  }
  editarEquipo(id: number, equipo: FormData): Observable<Equipo> {
    return this.http.put<Equipo>(`${this.apiUrl}equipo/${id}/`, equipo);
  }

  // Obtener todos los usuarios
  getAlmacen(): Observable<Almacen[]> {
    return this.http.get<Almacen[]>(`${this.apiUrl}almacen/`);
  }

  getObras(): Observable<Obra[]> {
    return this.http.get<Obra[]>(`${this.apiUrl}obra/`);
  }

  // equipos.service.ts

  getAlmacenesPorObra(obraId: number): Observable<Almacen[]> {
    console.log(`Obra ID seleccionado: ${obraId}`); // Log para verificar el valor
    return this.http.get<Almacen[]>(
      `${this.apiUrl}almacen/by_obra/?obra=${obraId}`
    );
  }
}
