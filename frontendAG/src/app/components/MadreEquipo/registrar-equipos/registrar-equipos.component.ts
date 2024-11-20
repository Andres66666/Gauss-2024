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
  @Output() listarEquipo = new EventEmitter<void>();

  constructor(private fb: FormBuilder, private equiposService: EquiposService) {
    // Inicializar el formulario con los controles necesarios
    this.registrarForm = this.fb.group({
      codigoEquipo: ['', Validators.required],
      nombreEquipo: ['', Validators.required],
      marcaEquipo: ['', Validators.required],
      modeloEquipo: ['', Validators.required],
      estadoDisponibilidad: ['', Validators.required],
      vidaUtilEquipo: ['', Validators.required],
      fechaAdquiscion: ['', Validators.required],
      horasUso: [0, [Validators.required, Validators.min(0)]],
      edadEquipo: ['', Validators.required],
      almacen: ['', Validators.required],
      almacen_global: [''], // Nuevo campo para el almacén global (opcional)
      cantMantCorrectivos: [0, Validators.min(0)], // Nuevo campo
      numFallasReportdas: [0, Validators.min(0)], // Nuevo campo
      imagenEquipos: [''],
    });
  }
  ngOnInit(): void {
    this.loadObras(); // Cargar las obras al iniciar el componente
  }

  loadAlmacenes() {
    this.equiposService.getAlmacen().subscribe((data) => {
      this.almacenes = data;
    });
  }

  loadObras() {
    this.equiposService.getObras().subscribe((data) => {
      this.obras = data; // Asignar la lista de obras
    });
  }

  onObraChange(event: Event) {
    const obraId = (event.target as HTMLSelectElement).value;
    const obraIdNumber = Number(obraId); // Asegurarse de que sea un número

    this.equiposService.getAlmacenesPorObra(obraIdNumber).subscribe(
      (almacenes) => {
        this.almacenes = almacenes; // Actualizar la lista de almacenes
      },
      (error) => {
        console.error('Error al cargar los almacenes:', error);
      }
    );
  }

  registrarEquipos() {
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
      'horasUso',
      this.registrarForm.get('horasUso')?.value.toString()
    ); // Convertir a string
    formData.append('edadEquipo', this.registrarForm.get('edadEquipo')?.value);

    // Asegúrate de que el almacén esté seleccionado
    const almacenId = this.registrarForm.get('almacen')?.value;
    if (!almacenId) {
      this.errorModal = 'Por favor, seleccione un almacén.';
      this.manejarModal = true;
      return; // Detener la ejecución si no hay almacén seleccionado
    }
    formData.append('almacen', almacenId);

    // Asegúrate de que el almacén global esté seleccionado si aplica
    const almacenGlobalId = this.registrarForm.get('almacen_global')?.value;
    if (almacenGlobalId) {
      formData.append('almacen_global', almacenGlobalId);
    }

    // Campos adicionales
    formData.append(
      'cantMantCorrectivos',
      this.registrarForm.get('cantMantCorrectivos')?.value || '0'
    ); // Default 0
    formData.append(
      'numFallasReportdas',
      this.registrarForm.get('numFallasReportdas')?.value || '0'
    ); // Default 0

    formData.append(
      'imagenEquipos',
      this.registrarForm.get('imagenEquipos')?.value
    );

    // Registrar equipo
    this.equiposService
      .registrarEquipos(formData as unknown as Equipo)
      .subscribe(
        (response) => {
          this.mensajeModal = 'Equipo registrado exitosamente';
          this.manejarModal = true;
          this.registrarForm.reset(); // Opcional: Reiniciar el formulario después de un registro exitoso
        },
        (error) => {
          this.errorModal = 'Error al registrar el equipo';
          this.manejarModal = true;
        }
      );
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
        imagenEquipos: file,
      });
      const reader = new FileReader();
      reader.onload = (e) => {
        this.imagenPreview = reader.result;
      };
      reader.readAsDataURL(file);
    }
  }
}
