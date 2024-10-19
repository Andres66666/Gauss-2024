import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Permiso, Rol, RolPermiso } from '../models/rol-permiso';

@Injectable({
  providedIn: 'root',
})
export class RolPermisoService {
  private apiUrl = 'http://localhost:8000/api/';

  constructor(private http: HttpClient) {}

  getRolePermisos(): Observable<RolPermiso[]> {
    return this.http.get<RolPermiso[]>(`${this.apiUrl}rol-permiso/`);
  }
  // Obtener un rol por ID
  getRolPermisoById(id: number): Observable<RolPermiso> {
    return this.http.get<RolPermiso>(`${this.apiUrl}rol-permiso/${id}/`);
  }

  // Registrar un nuevo rol-permiso
  /*   registrarRolPermiso(rolPermiso: RolPermiso): Observable<RolPermiso> {
    return this.http.post<RolPermiso>(`${this.apiUrl}rol-permiso/`, rolPermiso);
  } */
  registrarRolPermiso(rolPermiso: {
    rol: number;
    permisos: number[];
  }): Observable<RolPermiso> {
    return this.http.post<RolPermiso>(`${this.apiUrl}rol-permiso/`, rolPermiso);
  }

  editarRolPermiso(
    id: number,
    updatedRolPermiso: RolPermiso
  ): Observable<RolPermiso> {
    return this.http.put<RolPermiso>(
      `${this.apiUrl}rol-permiso/${id}/`,
      updatedRolPermiso
    );
  }

  // Obtener todos los roles
  getRoles(): Observable<Rol[]> {
    return this.http.get<Rol[]>(`${this.apiUrl}rol/`);
  }

  // Obtener todos los permisos
  getPermisos(): Observable<Permiso[]> {
    return this.http.get<Permiso[]>(`${this.apiUrl}permiso/`);
  }
}
