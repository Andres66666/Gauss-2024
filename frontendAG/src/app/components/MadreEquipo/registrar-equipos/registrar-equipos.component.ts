import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Almacen, Equipo, Obra } from '../models/equipos';
import { EquiposService } from '../service/equipos.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-registrar-equipos',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './registrar-equipos.component.html',
  styleUrls: ['./registrar-equipos.component.css'],
})
export class RegistrarEquiposComponent implements OnInit {
  registrarForm: FormGroup;
  obras: Obra[] = []; // Lista de obras disponibles
  almacenes: Almacen[] = []; // Para almacenar los almacenes disponibles

  manejarModal: boolean = false;
  mensajeModal: string = '';
  errorModal: string = '';
  selectedObraId: number = 0; // ID de la obra seleccionada
  esExito: boolean = false;
  mensaje: string = '';
  @Output() listarEquipo = new EventEmitter<void>();

  constructor(private fb: FormBuilder, private equiposService: EquiposService) {
    this.registrarForm = this.fb.group({
      codigoEquipo: ['', [Validators.required]],
      nombreEquipo: ['', [Validators.required]],
      marcaEquipo: ['', [Validators.required]],
      modeloEquipo: ['', [Validators.required]],
      vidaUtilEquipo: ['', [Validators.required]],
      fechaAdquiscion: ['', [Validators.required]],
      fechaFabricacion: [''], // Opcional
      imagenEquipos_url: [''], // Para cargar la imagen
      obra: ['', [Validators.required]], // Relación con una obra
      almacen: ['', [Validators.required]], // Relación con un almacén
    });
  }

  ngOnInit(): void {
    this.loadObras(); // Cargar las obras al iniciar el componente
  }

  loadObras() {
    this.equiposService.getObras().subscribe((data) => {
      this.obras = data; // Asignar la lista de obras
    });
  }

  onObraChange(event: Event) {
    const obraId = (event.target as HTMLSelectElement).value;
    const obraIdNumber = Number(obraId); // Asegurarte de que sea un número

    this.equiposService.getAlmacenesPorObra(obraIdNumber).subscribe(
      (almacenes) => {
        this.almacenes = almacenes; // Actualizar la lista de almacenes
        this.registrarForm.get('almacen')?.setValue(''); // Reiniciar el almacén seleccionado
        this.registrarForm.get('almacen')?.updateValueAndValidity(); // Asegurarse de que el formulario se actualice
      },
      (error) => {
        console.error('Error al cargar los almacenes:', error);
      }
    );
  }

  registrarEquipo() {
    if (this.registrarForm.valid) {
      const formData = new FormData(); // Usar FormData para incluir la imagen y los datos
      // Añadir cada campo del formulario al formData
      formData.append(
        'codigoEquipo',
        this.registrarForm.get('codigoEquipo')?.value
      );
      formData.append(
        'nombreEquipo',
        this.registrarForm.get('nombreEquipo')?.value
      );
      formData.append(
        'marcaEquipo',
        this.registrarForm.get('marcaEquipo')?.value
      );
      formData.append(
        'modeloEquipo',
        this.registrarForm.get('modeloEquipo')?.value
      );
      formData.append(
        'vidaUtilEquipo',
        this.registrarForm.get('vidaUtilEquipo')?.value
      );
      formData.append('estadoEquipo', 'true');
      formData.append(
        'estadoDisponibilidad',
        this.registrarForm.get('estadoDisponibilidad')?.value
      );
      formData.append(
        'vidaUtilEquipo',
        this.registrarForm.get('vidaUtilEquipo')?.value
      );
      formData.append(
        'fechaAdquiscion',
        this.registrarForm.get('fechaAdquiscion')?.value
      );
      formData.append(
        'fechaFabricacion',
        this.registrarForm.get('fechaFabricacion')?.value || ''
      );
      formData.append(
        'horasUso',
        this.registrarForm.get('horasUso')?.value.toString()
      );
      formData.append(
        'edadEquipo',
        this.registrarForm.get('edadEquipo')?.value
      );
      formData.append('obra', this.registrarForm.get('obra')?.value);
      formData.append('almacen', this.registrarForm.get('almacen')?.value);

      // Si se seleccionó una imagen, añadirla a formData
      const imagenInput = this.registrarForm.get('imagenEquipos_url')?.value;
      if (imagenInput) {
        // Validar el tamaño de la imagen
        if (imagenInput.size > 1024 * 1024 * 5) {
          this.mensaje = 'La imagen es demasiado grande. Debe ser menor a 5MB';
          this.esExito = false;
          return;
        }

        // Validar el tipo de archivo
        if (!['image/jpeg', 'image/png'].includes(imagenInput.type)) {
          this.mensaje = 'Solo se permiten archivos de tipo JPEG, PNG';
          this.esExito = false;
          return;
        }
        formData.append('imagenEquipos_url', imagenInput);
      }

      // Validar si el código de equipo ya existe
      this.equiposService.getEquipo().subscribe((equipos) => {
        const codigoExiste = equipos.find(
          (equipo) =>
            equipo.codigoEquipo ===
            this.registrarForm.get('codigoEquipo')?.value
        );

        if (codigoExiste) {
          this.mensaje = 'El código de equipo ya existe';
          this.esExito = false;
        } else {
          // Registrar equipo
          this.equiposService
            .registrarEquipos(formData as unknown as Equipo)
            .subscribe(
              (response) => {
                alert('Registro de equipo exitoso');
                this.listarEquipo.emit();
              },
              (error) => {
                alert('Error al registrar equipo');
              }
            );
        }
      });
    }
  }

  manejarOk() {
    this.manejarModal = false; // Cerrar el modal
    this.listarEquipo.emit(); // Emitir el evento para listar equipos
  }

  imagenPreview: string | ArrayBuffer | null = null;
  // Manejar la selección de archivo
  onFileChange(event: any): void {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.registrarForm.patchValue({
        imagenEquipos_url: file, // Corrected field name
      });
      const reader = new FileReader();
      reader.onload = (e) => {
        this.imagenPreview = reader.result;
      };
      reader.readAsDataURL(file);
    }
  }
}
