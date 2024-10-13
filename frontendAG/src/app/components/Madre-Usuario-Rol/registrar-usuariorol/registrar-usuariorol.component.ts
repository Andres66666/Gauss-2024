import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Rol, Usuario, Obra } from '../models/usuario-rol';
import { UsuarioRolService } from '../services/usuario-rol.service';
import { RolService } from '../../MadreRol/services/rol.service';
import { UsuarioService } from '../../MadreUsuario/services/usuario.service';

@Component({
  selector: 'app-registrar-usuariorol',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './registrar-usuariorol.component.html',
  styleUrl: './registrar-usuariorol.component.css',
})
export class RegistrarUsuariorolComponent {
  registrarForm: FormGroup;
  roles: Rol[] = [];
  obra: Obra[] = [];
  usuarios: Usuario[] = [];

  constructor(
    private fb: FormBuilder,
    private usuarioRolService: UsuarioRolService,
    private rolService: RolService,
    private usuarioService: UsuarioService
  ) {
    this.registrarForm = this.fb.group({
      rol: ['', Validators.required],
      usuario: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.loadRoles();
    this.loadUsuario();
  }

  loadRoles() {
    this.rolService.getRoles().subscribe((data) => {
      this.roles = data;
    });
  }
  loadObras() {
    this.usuarioRolService.getObras().subscribe((data) => {
      this.obra = data;
    });
  }
  loadUsuario() {
    this.usuarioService.getUsuarios().subscribe((data) => {
      this.usuarios = data;
    });
  }
  registrarUsarioRol() {
    if (this.registrarForm.valid) {
      this.usuarioRolService
        .registrarUsarioRol(this.registrarForm.value)
        .subscribe(
          (response) => {
            console.log('Usuario registrado exitosamente', response);
            setTimeout(() => {
              window.location.reload();
            }, 1000);
          },
          (error) => {
            console.error('Error al registrar el Rol-Permiso', error);
          }
        );
    }
  }
}
