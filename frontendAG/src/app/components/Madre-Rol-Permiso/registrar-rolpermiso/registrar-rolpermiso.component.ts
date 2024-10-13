import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Component } from '@angular/core';
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
            console.log('Rol-Permiso registrado exitosamente', response);
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
