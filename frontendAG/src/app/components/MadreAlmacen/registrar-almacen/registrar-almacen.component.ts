import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Almacen, Obra } from '../models/almacen';
import { AlmacenService } from '../service/almacen.service';

@Component({
  selector: 'app-registrar-almacen',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './registrar-almacen.component.html',
  styleUrl: './registrar-almacen.component.css',
})
export class RegistrarAlmacenComponent {
  registrarForm: FormGroup;
  obras: Obra[] = [];

  manejarModal: boolean = false;
  mensajeModal: string = '';
  errorModal: string = '';

  @Output() listarAlmacen = new EventEmitter<void>();

  constructor(private fb: FormBuilder, private almacenService: AlmacenService) {
    this.registrarForm = this.fb.group({
      nombreAlmacen: ['', Validators.required],
      obra: ['', Validators.required], // Relación con una obra
    });
  }
  ngOnInit(): void {
    this.loadObras();
  }
  loadObras() {
    this.almacenService.getObras().subscribe((data) => {
      this.obras = data;
    });
  }
  registrarAlmacen() {
    if (this.registrarForm.valid) {
      const nuevoAlmacen: Almacen = {
        ...this.registrarForm.value,
        estadoAlmacen: true, // El usuario se registra como activo por defecto
      };

      this.almacenService.registrarAlmacen(nuevoAlmacen).subscribe(
        (response) => {
          this.mensajeModal = 'Almacen registrado exitosamente'; // Mensaje para el modal
          this.manejarModal = true; // Mostrar el modal
        },
        (error) => {
          this.errorModal = 'Error al registrar el Almacen';
          this.manejarModal = true;
        }
      );
    }
  }
  manejarOk() {
    this.manejarModal = false;
    this.listarAlmacen.emit();
  }
}
