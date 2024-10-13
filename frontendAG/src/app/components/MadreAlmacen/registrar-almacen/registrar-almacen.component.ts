import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
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

  successMessage: string = '';
  errorMessage: string = '';
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
          this.successMessage = 'Almacen registrado exitosamente';
          setTimeout(() => {
            window.location.reload();
          }, 1000);
        },
        (error) => {
          this.errorMessage = 'Error al registrar el Almacen';
        }
      );
    }
  }
}
