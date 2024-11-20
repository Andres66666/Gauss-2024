import { Almacen, Obra } from './../models/almacen';
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
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
export class EditarAlmacenComponent implements OnInit {
  almacen: Almacen = {
    id: 0,
    nombreAlmacen: '',
    estadoAlmacen: true,
    obra: { id: 0, nombreObra: '', estadoObra: true, ubicacionObra: '' },
  };
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
      console.error('almacenId is null or undefined');
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
        this.almacen = data;
        this.initializeForm(); // Inicializa el formulario después de cargar los datos
      },
      error: (error) => {
        console.error('Error al cargar el almacén:', error);
      },
    });
  }

  initializeForm() {
    this.form = new FormGroup({
      nombreAlmacen: new FormControl(
        this.almacen.nombreAlmacen,
        Validators.required
      ),
      estadoAlmacen: new FormControl(this.almacen.estadoAlmacen),
      obra: new FormControl(this.almacen.obra.id, Validators.required),
    });
  }

  submit() {
    if (this.form.invalid) {
      return;
    }

    const updatedAlmacen: Almacen = {
      id: this.almacen.id,
      nombreAlmacen: this.form.value.nombreAlmacen,
      estadoAlmacen: this.form.value.estadoAlmacen,
      obra: {
        id: this.form.value.obra,
        nombreObra:
          this.obras.find((obra) => obra.id === this.form.value.obra)
            ?.nombreObra || '', // Obtener el nombre de la obra
        estadoObra:
          this.obras.find((obra) => obra.id === this.form.value.obra)
            ?.estadoObra || true, // Obtener el estado de la obra
        ubicacionObra:
          this.obras.find((obra) => obra.id === this.form.value.obra)
            ?.ubicacionObra || '', // Obtener la ubicación de la obra
      },
    };

    this.almacenService
      .editarAlmacen(this.almacen.id, updatedAlmacen)
      .subscribe({
        next: () => {
          this.mensajeModal = 'Almacén actualizado con éxito';
          this.manejarModal = true;
          this.listarAlmacenEditado.emit(); // Emitir evento para refrescar la lista
        },
        error: (error) => {
          this.errorModal = 'Error al actualizar el Almacén';
          this.manejarModal = true;
        },
      });
  }

  manejarOk() {
    this.manejarModal = false; // Cerrar el modal
    this.listarAlmacenEditado.emit(); // Emitir el evento para listar almacenes
  }
}
