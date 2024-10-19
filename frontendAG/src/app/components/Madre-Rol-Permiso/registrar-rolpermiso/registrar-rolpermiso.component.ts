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
  selectedPermisos: number[] = [];

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
      //permiso: ['', Validators.required],
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
  // Método para manejar los cambios de los checkboxes
  onCheckboxChange(e: any) {
    const id = +e.target.value;
    if (e.target.checked) {
      this.selectedPermisos.push(id); // Agrega el permiso seleccionado
    } else {
      const index = this.selectedPermisos.indexOf(id);
      if (index > -1) {
        this.selectedPermisos.splice(index, 1); // Elimina el permiso deseleccionado
      }
    }
  }

  registrarRolPermiso() {
    if (this.registrarForm.valid && this.selectedPermisos.length > 0) {
      const rolPermisoData = {
        rol: this.registrarForm.value.rol,
        permisos: this.selectedPermisos,
      };

      this.rolPermisoService.registrarRolPermiso(rolPermisoData).subscribe(
        (response) => {
          this.mensajeModal = 'Rol y permisos registrados correctamente.';
          this.manejarModal = true;
        },
        (error) => {
          this.errorModal = 'Error al registrar el rol y permisos.';
          this.manejarModal = true;
        }
      );
    } else {
      this.errorModal = 'Debe seleccionar un rol y al menos un permiso.';
      this.manejarModal = true;
    }
  }

  manejarOk() {
    this.manejarModal = false; // Cerrar el modal
    this.listarRolPermiso.emit(); // Emitir el evento para listar usuarios
  }
}
