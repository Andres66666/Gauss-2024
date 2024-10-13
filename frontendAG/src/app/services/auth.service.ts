import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

interface Usuario {
  id: number;
  correo: string;
  nombreUsuario: string;
  apellido: string;
  roles: string[];
  permisos: string[];
  activo: boolean; // Add this property to check if the user is active
  mensaje?: string;
  error?: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:8000/api/'; // Ajusta según tu configuración real
  private roles: string[] = [];
  private permisos: string[] = [];
  private correo: string = ''; // Variable para almacenar el correo
  private nombreUsuario: string = ''; // Variable para almacenar el nombre de usuario
  public apellido: string | null = null; // Variable para almacenar el nombre de usuario

  constructor(private http: HttpClient) {}

  login(correo: string, password: string): Observable<Usuario> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const body = { correo, password };
    return this.http
      .post<Usuario>(`${this.apiUrl}login/`, body, { headers })
      .pipe(
        tap((usuario) => {
          localStorage.setItem('usuario', JSON.stringify(usuario)); // para mantener los datos cuando se recargue la pagina
          this.roles = usuario.roles;
          this.permisos = usuario.permisos;
          this.correo = usuario.correo; // Guardar el correo
          this.nombreUsuario = usuario.nombreUsuario; // Guardar el nombre de usuario
          this.apellido = usuario.apellido; // Guardar el nombre de usuario
        })
      );
  }
  getCorreo(): string {
    return this.correo; // Método para obtener el correo
  }
  getNombreUsuario(): string {
    return this.nombreUsuario; // Método para obtener el nombre de usuario
  }
  getNombreCompleto(): string | null {
    // Recupera el nombre completo almacenado en el localStorage
    const usuario = JSON.parse(localStorage.getItem('usuario') || '{}');
    return `${usuario.nombreUsuario} ${usuario.apellido}`;
  }

  getRoles(): string[] {
    return this.roles;
  }

  getPermisos(): string[] {
    return this.permisos;
  }
}
