import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';

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
  access?: string;
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

  constructor(private http: HttpClient, private router: Router) {}

  login(correo: string, password: string): Observable<Usuario> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const body = { correo, password };
    return this.http
      .post<Usuario>(`${this.apiUrl}login/`, body, { headers })
      .pipe(
        tap((usuario) => {
          if (usuario.access) {
            localStorage.setItem('token', usuario.access); // Almacenar el token
          }
          localStorage.setItem('usuario', JSON.stringify(usuario)); // para mantener los datos cuando se recargue la pagina
          this.roles = usuario.roles;
          this.permisos = usuario.permisos;
          this.correo = usuario.correo; // Guardar el correo
          this.nombreUsuario = usuario.nombreUsuario; // Guardar el nombre de usuario
          this.apellido = usuario.apellido; // Guardar el nombre de usuario
        })
      );
  }
  // Método para obtener el token
  getToken(): string | null {
    return localStorage.getItem('token');
  }

  // Método para agregar el token a las cabeceras
  getAuthHeaders(): HttpHeaders {
    const token = this.getToken();
    return new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`, // Agregar el token a las cabeceras
    });
  }
  getProtectedData(): Observable<any> {
    const headers = this.getAuthHeaders(); // Obtener cabeceras con el token
    return this.http.get<any>(`${this.apiUrl}protected-endpoint/`, { headers });
  }
  // Verificar si el usuario está autenticado (Token presente en localStorage)
  isAuthenticated(): boolean {
    return localStorage.getItem('token') !== null;
  }

  // Función para manejar el cierre de sesión
  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    localStorage.removeItem('usuario_id');
    this.router.navigate(['/login']);
  }

  getUsuarioLocalStorage() {
    const usuario = localStorage.getItem('usuario');
    return usuario ? JSON.parse(usuario) : null; // Asegúrate de que el usuario se parsea correctamente
  }
  // Obtener el usuario desde localStorage
  private getUserFromLocalStorage(): Usuario | null {
    const user = localStorage.getItem('usuario');
    return user ? JSON.parse(user) : null;
  }
}
