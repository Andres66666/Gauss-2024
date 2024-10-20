import { Permiso } from './../models/permiso';
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';

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
    return this.http
      .post<Permiso>(`${this.apiUrl}permiso/`, permiso)
      .pipe(catchError(this.handleError));
  }
  editarPermiso(id: number, permiso: Permiso): Observable<Permiso> {
    return this.http
      .put<Permiso>(`${this.apiUrl}permiso/${id}/`, permiso)
      .pipe(catchError(this.handleError));
  }
  // Actualizar estado de un Permiso
  actualizarEstadoPermiso(id: number, activo: boolean): Observable<any> {
    return this.http.put(`${this.apiUrl}permiso/${id}/`, { activo: activo });
  }

  private handleError(error: HttpErrorResponse) {
    if (error.status === 409) {
      return throwError(
        () => new Error('El nombre del permiso ya existe en la base de datos.')
      );
    } else {
      return throwError(
        () => new Error('Ocurrió un error al registrar el permiso.')
      );
    }
  }
}
