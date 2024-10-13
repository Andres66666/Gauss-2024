import { Component, Input, OnInit } from '@angular/core';
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
  successMessage: string = '';
  errorMessage: string = '';

  @Input() rolId: number | null = null; // Allow null value

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
      error: (error) => {
        this.errorMessage = 'Error al cargar los datos del rol';
        console.error('Error al cargar los datos:', error);
      },
    });
  }

  initializeForm() {
    this.form = new FormGroup({
      nombreRol: new FormControl(this.rol.nombreRol, Validators.required),
      activo: new FormControl(this.rol.activo),
    });
  }

  submit() {
    if (this.form.invalid) {
      // Check if the form is invalid
      this.errorMessage = 'Por favor completa todos los campos requeridos'; // Show error message
      return; // Exit early if the form is invalid
    }

    const updatedRol = { ...this.rol, ...this.form.value };
    this.rolService.editarRol(this.rol.id, updatedRol).subscribe({
      next: (data) => {
        console.log(data);
        this.successMessage = 'Rol actualizado con éxito';
        setTimeout(() => {
          window.location.reload(); // Redirect to roles list after success
        }, 1000); // Wait before redirecting
      },
      error: (error) => {
        this.errorMessage = 'Error al actualizar el rol';
        console.error('Error al actualizar el rol:', error);
      },
    });
  }
}
