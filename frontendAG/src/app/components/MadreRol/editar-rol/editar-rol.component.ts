import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Rol } from '../models/rol';
import { CommonModule } from '@angular/common';
import {
  FormControl,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { RolService } from '../services/rol.service';

@Component({
  selector: 'app-editar-rol',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './editar-rol.component.html',
  styleUrl: './editar-rol.component.css',
})
export class EditarRolComponent implements OnInit {
  rol: Rol = {
    id: 0,
    nombreRol: '',
    activo: true,
  };

  form!: FormGroup; // Declare form as a class property
  manejarModal: boolean = false;
  mensajeModal: string = '';
  errorModal: string = '';
  @Input() rolId: number | null = null; // Allow null value
  @Output() listarRolEditado = new EventEmitter<void>();

  constructor(
    private rolService: RolService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    if (this.rolId !== null) {
      this.loadRolData(this.rolId);
    } else {
      console.error('rolID is null or undefined');
    }
  }

  loadRolData(id: number) {
    this.rolService.getRolById(id).subscribe({
      next: (data) => {
        this.rol = data;
        this.initializeForm(); // Initialize form after loading role data
      },
    });
  }

  initializeForm() {
    this.form = new FormGroup({
      nombreRol: new FormControl(this.rol.nombreRol, Validators.required),
      activo: new FormControl(this.rol.activo),
    });
  }
  // Método para evitar la entrada de números
  preventNumbers(event: KeyboardEvent) {
    const regex = /^[a-zA-Z\s]*$/;
    const inputChar = String.fromCharCode(event.keyCode);

    // Si no es una letra o espacio, prevenir la entrada
    if (!regex.test(inputChar)) {
      event.preventDefault();
    }
  }

  submit() {
    if (this.form.invalid) {
      return; // Exit early if the form is invalid
    }

    const updatedRol = { ...this.rol, ...this.form.value };
    this.rolService.editarRol(this.rol.id, updatedRol).subscribe({
      next: (data) => {
        console.log(data);
        this.mensajeModal = 'Rol actualizado con éxito';
        this.manejarModal = true;
      },
      error: (error) => {
        if (error.message.includes('ya existe')) {
          this.errorModal = 'Error al editar: \n' + error.message; // Mensaje de duplicado
        } else {
          this.errorModal = 'Error al registrar el rol';
        }
        this.manejarModal = true;
      },
    });
  }
  manejarOk() {
    this.manejarModal = false;
    this.listarRolEditado.emit();
  }
}
