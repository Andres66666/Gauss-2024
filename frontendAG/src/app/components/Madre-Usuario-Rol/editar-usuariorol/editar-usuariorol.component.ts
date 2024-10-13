import { Component, Input, OnInit } from '@angular/core';
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
  successMessage: string = '';
  errorMessage: string = '';

  @Input() usuarioRolId: number | null = null;

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
      error: (error) => {
        this.errorMessage =
          'Error al cargar los datos de la relación Usuario Rol';
        console.error('Error al cargar los datos:', error);
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
      error: (error) => {
        console.error('Error al cargar los roles:', error);
      },
    });
  }
  loadObras(): void {
    this.UsuarioRolService.getObras().subscribe({
      next: (obras) => {
        this.obra = obras;
      },
      error: (error) => {
        console.error('Error al cargar los roles:', error);
      },
    });
  }

  // Cargar los usuarios disponibles desde el backend
  loadUsuarios(): void {
    this.usuarioService.getUsuarios().subscribe({
      next: (usuarios) => {
        this.usuarios = usuarios;
      },
      error: (error) => {
        console.error('Error al cargar los usuarios:', error);
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
      ).subscribe(() => {
        alert('Usuario Rol actualizado exitosamente');
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      });
    }
  }
}
