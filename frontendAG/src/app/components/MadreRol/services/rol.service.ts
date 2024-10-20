import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
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
    return this.http
      .post<Rol>(`${this.apiUrl}rol/`, rol)
      .pipe(catchError(this.handleError));
  }
  editarRol(id: number, rol: Rol): Observable<Rol> {
    return this.http
      .put<Rol>(`${this.apiUrl}rol/${id}/`, rol)
      .pipe(catchError(this.handleError));
  }
  private handleError(error: HttpErrorResponse) {
    if (error.status === 409) {
      return throwError(
        () => new Error('El nombre del rol ya existe en la base de datos.')
      );
    } else {
      return throwError(
        () => new Error('Ocurrió un error al registrar el rol.')
      );
    }
  }
}
