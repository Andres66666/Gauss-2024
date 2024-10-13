import { Usuario } from './../MadreUsuario/models/usuario';
import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  correo: string = '';
  password: string = '';
  mensaje: string = '';
  error: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit(): void {
    this.authService.login(this.correo, this.password).subscribe(
      (response) => {
        // Check if user is active
        if (response.activo === false) {
          this.error =
            'No puedes iniciar sesión!!!. Comuníquese con el administrador. Gracias.';
          this.mensaje = '';
          return; // Exit early if user is inactive
        }

        if (response.mensaje) {
          this.mensaje = response.mensaje;
          this.error = '';
          this.router.navigate(['/index']);
        } else if (response.error) {
          this.error = response.error;
          this.mensaje = '';
        }
      },
      (err: HttpErrorResponse) => {
        this.error = err.error?.error || 'Error en el servidor';
        this.mensaje = ''; // Clear message on error
      }
    );
  }
}
