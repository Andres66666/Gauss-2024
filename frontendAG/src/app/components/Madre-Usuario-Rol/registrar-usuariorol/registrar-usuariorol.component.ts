import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
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

  manejarModal: boolean = false;
  mensajeModal: string = '';
  errorModal: string = '';
  @Output() listarUsuarioRol = new EventEmitter<void>();

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
            this.mensajeModal = 'Usuario Rol registrado exitosamente'; // Mensaje para el modal
            this.manejarModal = true;
          },
          (error) => {
            this.errorModal = 'Error al registrar el usuario rol';
            this.manejarModal = true;
          }
        );
    }
  }
  manejarOk() {
    this.manejarModal = false; // Cerrar el modal
    this.listarUsuarioRol.emit(); // Emitir el evento para listar usuarios
  }
}
