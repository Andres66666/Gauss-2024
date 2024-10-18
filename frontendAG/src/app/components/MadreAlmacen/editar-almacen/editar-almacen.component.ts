import { Almacen, Obra } from './../models/almacen';
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
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
  form!: FormGroup;

  manejarModal: boolean = false;
  mensajeModal: string = '';
  errorModal: string = '';

  @Input() almacenId: number | null = null;
  @Output() listarAlmacenEditado = new EventEmitter<void>();

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
    });
  }
  loadAlmacenData(id: number) {
    this.almacenService.getAlmacenById(id).subscribe({
      next: (data) => {
        this.almacenes = data;
        this.initializeForm();
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
            this.mensajeModal = 'Almacen actualizado con éxito';
            this.manejarModal = true;
          },
          error: (err) => {
            this.errorModal = 'Error al actualizar el Almacen';
            this.manejarModal = true;
          },
        });
    }
  }
  manejarOk() {
    this.manejarModal = false;
    this.listarAlmacenEditado.emit();
  }
}
