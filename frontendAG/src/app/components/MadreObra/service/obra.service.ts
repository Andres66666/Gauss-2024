import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Obra } from '../models/obra';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ObraService {
  private apiUrl = 'http://localhost:8000/api/'; // URL del backend de Django
  constructor(private http: HttpClient) {}

  // Obtener todos los Obra
  getObra(): Observable<Obra[]> {
    return this.http.get<Obra[]>(`${this.apiUrl}obra/`);
  }
  // Obtener un Obra por ID
  getObraById(id: number): Observable<Obra> {
    return this.http.get<Obra>(`${this.apiUrl}obra/${id}/`);
  }
  registrarObra(obra: Obra): Observable<Obra> {
    return this.http.post<Obra>(`${this.apiUrl}obra/`, obra);
  }
  editarObra(id: number, obra: Obra): Observable<Obra> {
    return this.http.put<Obra>(`${this.apiUrl}obra/${id}/`, obra);
  }
}
