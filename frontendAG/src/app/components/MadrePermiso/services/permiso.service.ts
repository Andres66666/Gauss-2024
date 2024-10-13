import { Permiso } from './../models/permiso';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PermisoService {
  private apiUrl = 'http://localhost:8000/api/'; // URL del backend de Django
  constructor(private http: HttpClient) {}

  // Obtener todos los Permiso
  getPermisos(): Observable<Permiso[]> {
    return this.http.get<Permiso[]>(`${this.apiUrl}permiso/`);
  }

  // Obtener un Permiso por ID
  getPermisoById(id: number): Observable<Permiso> {
    return this.http.get<Permiso>(`${this.apiUrl}permiso/${id}/`);
  }

  registrarPermiso(permiso: Permiso): Observable<Permiso> {
    return this.http.post<Permiso>(`${this.apiUrl}permiso/`, permiso);
  }
  editarPermiso(id: number, permiso: Permiso): Observable<Permiso> {
    return this.http.put<Permiso>(`${this.apiUrl}permiso/${id}/`, permiso);
  }
  // Actualizar estado de un Permiso
  actualizarEstadoPermiso(id: number, activo: boolean): Observable<any> {
    return this.http.put(`${this.apiUrl}permiso/${id}/`, { activo: activo });
  }
}
