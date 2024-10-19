import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Almacen, Equipo, Mantenimiento, Obra } from '../models/mantenimiento';
import { MantenimientoService } from '../service/mantenimiento.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-registrar-mantenimiento',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './registrar-mantenimiento.component.html',
  styleUrl: './registrar-mantenimiento.component.css',
})
export class RegistrarMantenimientoComponent implements OnInit {
  registrarForm: FormGroup;
  equipos: Equipo[] = [];
  almacenes: Almacen[] = [];
  obras: Obra[] = [];
  almacenSeleccionado: any;
  obraSeleccionada: any;
  tipoResponsable: string = 'persona'; // Valor por defecto

  manejarModal: boolean = false;
  mensajeModal: string = '';
  errorModal: string = '';

  @Output() listarMantenimiento = new EventEmitter<void>();

  constructor(
    private fb: FormBuilder,
    private mantenimientoService: MantenimientoService
  ) {
    this.registrarForm = this.fb.group({
      fechaInicio: ['', Validators.required],
      fechaFin: ['', Validators.required],
      tipoMantenimiento: ['', Validators.required],
      detalleMantenimiento: ['', Validators.required],
      responsable: ['', Validators.required],
      equipo: ['', Validators.required],
      almacenId: [''],
      obraId: [''],
      tipoResponsable: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.loadEquipos();
    this.loadAlmacenes();
    this.loadObras();

    this.mantenimientoService.getEquipos().subscribe((data) => {
      this.equipos = data;
    });
    this.mantenimientoService.getAlmacenes().subscribe((data) => {
      this.almacenes = data;
    });
  }

  onTipoResponsableChange(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    this.registrarForm.get('tipoResponsable')?.setValue(selectElement.value); // Actualiza el valor en el formulario
  }

  seleccionarEquipo(equipoId: string) {
    const id = parseInt(equipoId, 10);
    const equipo = this.equipos.find((e) => e.id === id);
    if (equipo) {
      const almacenId = equipo.almacen.id;
      const almacen = this.almacenes.find((a) => a.id === almacenId);
      if (almacen) {
        this.almacenSeleccionado = almacen.nombreAlmacen;
        const obraId = almacen.obra.id;
        const obra = this.obras.find((o) => o.id === obraId);
        if (obra) {
          this.obraSeleccionada = obra.nombreObra;
          const detalleMantenimientoControl = this.registrarForm.get(
            'detalleMantenimiento'
          );
          if (detalleMantenimientoControl) {
            const detalleMantenimiento = detalleMantenimientoControl.value;
            const texto = `Equipo: ${equipo.nombreEquipo}, Almacen: ${almacen.nombreAlmacen}, Obra: ${obra.nombreObra}`;
            detalleMantenimientoControl.setValue(
              detalleMantenimiento + '\n' + texto
            );
          }
        }
      }
    }
  }
  loadEquipos() {
    this.mantenimientoService.getEquipos().subscribe((data) => {
      this.equipos = data;
    });
  }

  loadAlmacenes() {
    this.mantenimientoService.getAlmacenes().subscribe((data) => {
      this.almacenes = data;
    });
  }

  loadObras() {
    this.mantenimientoService.getObras().subscribe((data) => {
      this.obras = data;
    });
  }
  registrarMantenimiento() {
    if (this.registrarForm.valid) {
      const detalleMantenimientoControl = this.registrarForm.get(
        'detalleMantenimiento'
      );
      const equipoControl = this.registrarForm.get('equipo');

      if (detalleMantenimientoControl && equipoControl) {
        const tipoResponsable =
          this.registrarForm.get('tipoResponsable')?.value;
        const responsable = this.registrarForm.get('responsable')?.value;

        // Formatear el responsable
        const responsableFormateado = `${tipoResponsable}: ${responsable}`;

        const nuevoMantenimiento: Mantenimiento = {
          ...this.registrarForm.value,
          equipoId: parseInt(equipoControl.value),
          almacenId: this.almacenSeleccionado, // Asegúrate de que esto sea el ID y no el nombre
          obraId: this.obraSeleccionada, // Asegúrate de que esto sea el ID y no el nombre
          detalleMantenimiento: detalleMantenimientoControl.value,
          responsable: responsableFormateado,
          estadoMantenimiento: true,
        };

        this.mantenimientoService
          .createMantenimiento(nuevoMantenimiento)
          .subscribe(
            (response) => {
              this.mensajeModal = 'Mantenimiento registrado exitosamente'; // Mensaje para el modal
              this.manejarModal = true; // Mostrar el modal
            },
            (error) => {
              this.errorModal = 'Error al registrar el mantenimiento';
              this.manejarModal = true;
            }
          );
      }
    }
  }

  manejarOk() {
    this.manejarModal = false; // Cerrar el modal
    this.listarMantenimiento.emit(); // Emitir el evento para listar usuarios
  }
}
