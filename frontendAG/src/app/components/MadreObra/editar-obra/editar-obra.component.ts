import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Obra } from '../models/obra';
import { CommonModule } from '@angular/common';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ObraService } from '../service/obra.service';

@Component({
  selector: 'app-editar-obra',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './editar-obra.component.html',
  styleUrl: './editar-obra.component.css',
})
export class EditarObraComponent implements OnInit {
  obra: Obra = {
    id: 0,
    nombreObra: '',
    ubicacionObra: '',
    estadoObra: true,
  };
  form!: FormGroup; // Declare form as a class property
  manejarModal: boolean = false;
  mensajeModal: string = '';
  errorModal: string = '';
  @Input() obraId: number | null = null;
  @Output() listarObraEditado = new EventEmitter<void>();

  constructor(private obraServise: ObraService) {}

  ngOnInit(): void {
    if (this.obraId !== null) {
      this.loadPermisoData(this.obraId);
    } else {
      console.error('obras is null or undefined');
    }
  }
  loadPermisoData(id: number) {
    this.obraServise.getObraById(id).subscribe({
      next: (data) => {
        this.obra = data;
        this.initializerFrom();
      },
    });
  }
  initializerFrom() {
    this.form = new FormGroup({
      nombreObra: new FormControl(this.obra.nombreObra, Validators.required),
      ubicacionObra: new FormControl(this.obra.ubicacionObra),
      estadoObra: new FormControl(this.obra.estadoObra),
    });
  }
  submit() {
    if (this.form.invalid) {
      return;
    }
    const updatedObra = { ...this.obra, ...this.form.value };
    this.obraServise.editarObra(this.obra.id, updatedObra).subscribe({
      next: (data) => {
        console.log(data);
        this.mensajeModal = 'Obra actualizado con éxito';
        this.manejarModal = true;
      },
      error: (error) => {
        this.errorModal = 'Error al actualizar el Obra';
        this.manejarModal = true;
      },
    });
  }
  manejarOk() {
    this.manejarModal = false;
    this.listarObraEditado.emit();
  }
}
