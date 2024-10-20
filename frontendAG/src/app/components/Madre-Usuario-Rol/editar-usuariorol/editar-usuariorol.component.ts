import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Rol, Usuario, UsuarioRol, Obra } from '../models/usuario-rol';
import {
  FormControl,
  FormGroup,
  FormsModule,
  Validators,
} from '@angular/forms';
import { RolService } from '../../MadreRol/services/rol.service';
import { UsuarioService } from '../../MadreUsuario/services/usuario.service';
import { UsuarioRolService } from '../services/usuario-rol.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-editar-usuariorol',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './editar-usuariorol.component.html',
  styleUrl: './editar-usuariorol.component.css',
})
export class EditarUsuariorolComponent implements OnInit {
  usuarioRol!: UsuarioRol;
  roles: Rol[] = [];
  usuarios: Usuario[] = [];
  obra: Obra[] = [];

  form!: FormGroup;

  manejarModal: boolean = false;
  mensajeModal: string = '';
  errorModal: string = '';
  @Input() usuarioRolId: number | null = null;
  @Output() listarUsuarioRolEditado = new EventEmitter<void>();

  constructor(
    private UsuarioRolService: UsuarioRolService,
    private rolService: RolService,
    private usuarioService: UsuarioService
  ) {}

  ngOnInit(): void {
    this.loadRoles();
    this.loadUsuarios();
    this.loadObras();

    if (this.usuarioRolId !== null) {
      this.loadUsuarioRolData(this.usuarioRolId);
    } else {
      console.error('usuario Rol es nulo o definido');
    }
  }

  loadUsuarioRolData(id: number): void {
    this.UsuarioRolService.getUsuarioRolById(id).subscribe({
      next: (data) => {
        this.usuarioRol = data;
        this.initializeForm();
      },
    });
  }
  initializeForm(): void {
    this.form = new FormGroup({
      rol: new FormControl(this.usuarioRol.rol.id, Validators.required),
      usuario: new FormControl(this.usuarioRol.usuario.id, Validators.required),
      obra: new FormControl(
        this.usuarioRol.usuario.obra.id,
        Validators.required
      ),
    });
  }

  // Cargar los roles disponibles desde el backend
  loadRoles(): void {
    this.rolService.getRoles().subscribe({
      next: (roles) => {
        this.roles = roles;
      },
    });
  }
  loadObras(): void {
    this.UsuarioRolService.getObras().subscribe({
      next: (obras) => {
        this.obra = obras;
      },
    });
  }

  // Cargar los usuarios disponibles desde el backend
  loadUsuarios(): void {
    this.usuarioService.getUsuarios().subscribe({
      next: (usuarios) => {
        this.usuarios = usuarios;
      },
    });
  }
  onSubmit(): void {
    if (this.usuarioRol) {
      const updatedUsuarioRol: UsuarioRol = {
        id: this.usuarioRol.id,
        rol: {
          id: this.usuarioRol.rol.id, // Utiliza el valor del formulario
          nombreRol: this.usuarioRol.rol.nombreRol,
          activo: this.usuarioRol.rol.activo,
        },
        usuario: {
          id: this.usuarioRol.usuario.id,
          nombreUsuario: this.usuarioRol.usuario.nombreUsuario,
          apellido: this.usuarioRol.usuario.apellido,
          telefono: this.usuarioRol.usuario.telefono,
          correo: this.usuarioRol.usuario.correo,
          ci: this.usuarioRol.usuario.ci,
          fecha_creacion: this.usuarioRol.usuario.fecha_creacion,
          activo: this.usuarioRol.usuario.activo,
          obra: {
            id: this.usuarioRol.usuario.obra.id,
            nombreObra: this.usuarioRol.usuario.obra.nombreObra,
            estadoObra: this.usuarioRol.usuario.obra.estadoObra,
            ubicacionObra: this.usuarioRol.usuario.obra.ubicacionObra,
          },
        },
      };
      this.UsuarioRolService.editarUsuarioRol(
        this.usuarioRol.id,
        updatedUsuarioRol
      ).subscribe({
        next: () => {
          this.mensajeModal = 'Usuario Rol Actualizado con éxito';
          this.manejarModal = true;
        },
        error: (error) => {
          if (error.error && error.error.error) {
            // Concatenar mensajes de error desde views.py
            this.errorModal = error.error.error.join('<br>');
          } else {
            this.errorModal = 'Error al actualizar el usuario rol.';
          }
          this.manejarModal = true;
        },
      });
    } else {
      this.errorModal = 'Por favor, completa todos los campos requeridos.';
      this.manejarModal = true;
    }
  }
  manejarOk() {
    this.manejarModal = false;
    this.listarUsuarioRolEditado.emit();
  }
}
