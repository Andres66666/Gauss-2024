import { Almacen, Obra } from './../models/almacen';
import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AlmacenService } from '../service/almacen.service';

@Component({
  selector: 'app-editar-almacen',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './editar-almacen.component.html',
  styleUrl: './editar-almacen.component.css',
})
export class EditarAlmacenComponent {
  almacenes!: Almacen;
  obras: Obra[] = [];
  form!: FormGroup; // Declare form as a class property
  successMessage: string = '';
  errorMessage: string = '';

  @Input() almacenId: number | null = null; // Allow null value
  constructor(private almacenService: AlmacenService) {}

  ngOnInit(): void {
    this.loadObras();
    if (this.almacenId !== null) {
      this.loadAlmacenData(this.almacenId);
    } else {
      console.error('usuarioId is null or undefined');
    }
  }
  loadObras(): void {
    this.almacenService.getObras().subscribe({
      next: (obra) => {
        this.obras = obra;
      },
      error: (error) => {
        console.error('Error al cargar los roles:', error);
      },
    });
  }
  loadAlmacenData(id: number) {
    this.almacenService.getAlmacenById(id).subscribe({
      next: (data) => {
        this.almacenes = data; // Populate form with user data
        this.initializeForm(); // Initialize form after loading user data
      },
      error: (error) => {
        this.errorMessage = 'Error al cargar los datos del usuario.';
        console.error('Error loading user data:', error);
      },
    });
  }

  initializeForm() {
    this.form = new FormGroup({
      nombreAlmacen: new FormControl(
        this.almacenes.nombreAlmacen,
        Validators.required
      ),
      estadoAlmacen: new FormControl(this.almacenes.estadoAlmacen),
      obra: new FormControl(this.almacenes.obra.id, Validators.required),
    });
  }
  onSubmit(): void {
    if (this.form.valid) {
      const updatedAlmacen: Almacen = {
        id: this.almacenes.id,
        nombreAlmacen: this.form.value.nombreAlmacen,
        estadoAlmacen: this.form.value.estadoAlmacen,
        obra: {
          id: this.form.value.obra,
          nombreObra: this.almacenes.obra.nombreObra,
          estadoObra: this.almacenes.obra.estadoObra,
          ubicacionObra: this.almacenes.obra.ubicacionObra,
        },
      };
      this.almacenService
        .editarAlmacen(this.almacenes.id, updatedAlmacen)
        .subscribe({
          next: () => {
            this.successMessage = 'Almacen actualizado exitosamente';
            setTimeout(() => {
              window.location.reload();
            }, 1000);
          },
          error: (err) => {
            this.errorMessage = this.errorMessage =
              'Error al actualizar el almacen';
          },
        });
    } else {
      this.errorMessage = 'El formulario no es válido';
    }
  }
}
