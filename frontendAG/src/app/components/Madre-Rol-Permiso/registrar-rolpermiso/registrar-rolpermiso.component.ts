import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Component, EventEmitter, Output } from '@angular/core';
import { RolPermisoService } from './../services/rol-permiso.service';
import { Rol } from '../../MadreRol/models/rol';
import { Permiso } from '../../MadrePermiso/models/permiso';
import { RolService } from '../../MadreRol/services/rol.service';
import { PermisoService } from '../../MadrePermiso/services/permiso.service';

@Component({
  selector: 'app-registrar-rolpermiso',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './registrar-rolpermiso.component.html',
  styleUrl: './registrar-rolpermiso.component.css',
})
export class RegistrarRolpermisoComponent {
  registrarForm: FormGroup;
  roles: Rol[] = [];
  permisos: Permiso[] = [];

  manejarModal: boolean = false;
  mensajeModal: string = '';
  errorModal: string = '';

  @Output() listarRolPermiso = new EventEmitter<void>();

  constructor(
    private fb: FormBuilder,
    private rolPermisoService: RolPermisoService,
    private rolService: RolService,
    private permisoService: PermisoService
  ) {
    this.registrarForm = this.fb.group({
      rol: ['', Validators.required],
      permiso: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.loadRoles();
    this.loadPermisos();
  }

  loadRoles() {
    this.rolService.getRoles().subscribe((data) => {
      this.roles = data;
    });
  }

  loadPermisos() {
    this.permisoService.getPermisos().subscribe((data) => {
      this.permisos = data;
    });
  }

  registrarRolPermiso() {
    if (this.registrarForm.valid) {
      this.rolPermisoService
        .registrarRolPermiso(this.registrarForm.value)
        .subscribe(
          (response) => {
            this.mensajeModal = 'Rol Permiso registrado exitosamente'; // Mensaje para el modal
            this.manejarModal = true; // Mostrar el modal
          },
          (error) => {
            this.mensajeModal = 'Error a la registrar Rol Permiso'; // Mensaje para el modal
            this.manejarModal = true; // Mostrar el modal
          }
        );
    }
  }
  manejarOk() {
    this.manejarModal = false; // Cerrar el modal
    this.listarRolPermiso.emit(); // Emitir el evento para listar usuarios
  }
}
