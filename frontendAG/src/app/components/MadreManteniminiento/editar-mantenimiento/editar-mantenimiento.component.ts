import { MantenimientoService } from './../service/mantenimiento.service';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  Almacen,
  Equipo,
  Mantenimiento,
  Obra,
} from './../models/mantenimiento';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-editar-mantenimiento',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './editar-mantenimiento.component.html',
  styleUrl: './editar-mantenimiento.component.css',
})
export class EditarMantenimientoComponent implements OnInit {
  mantenimiento!: Mantenimiento;
  equipo: Equipo[] = [];
  almacen: Almacen[] = [];
  obra: Obra[] = [];

  form!: FormGroup; // Declare form as a class property
  almacenSeleccionado: string = '';
  obraSeleccionada: string = '';

  manejarModal: boolean = false;
  mensajeModal: string = '';
  errorModal: string = '';
  @Output() listarMantenimientoEditado = new EventEmitter<void>();

  @Input() mantenimientoId: number | null = null; // Allow null value

  constructor(
    private mantenimientoService: MantenimientoService,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router
  ) {
    // Inicializar el formulario
    this.form = this.fb.group({
      fechaInicio: ['', Validators.required],
      fechaFin: ['', Validators.required],
      estadoMantenimiento: ['', Validators.required],
      tipoMantenimiento: ['', Validators.required],
      detalleMantenimiento: ['', Validators.required],
      responsable: ['', Validators.required],
      equipo: ['', Validators.required],
      almacenId: [''],
      obraId: [''],
    });
  }

  ngOnInit(): void {
    this.loadEquipo();
    this.loadAlmacen();
    this.loadObra();
    if (this.mantenimientoId !== null) {
      this.loadMantenimientoData(this.mantenimientoId);
    } else {
      console.error('mantenimientoId is null or undefined');
    }
  }
  loadEquipo(): void {
    this.mantenimientoService.getEquipos().subscribe({
      next: (data) => {
        this.equipo = data;
      },
      error: (error) => {
        console.error('Error al cargar los equipos:', error);
      },
    });
  }
  loadAlmacen(): void {
    this.mantenimientoService.getAlmacenes().subscribe({
      next: (data) => {
        this.almacen = data;
      },
      error: (error) => {
        console.error('Error al cargar los equipos:', error);
      },
    });
  }
  loadObra(): void {
    this.mantenimientoService.getObras().subscribe({
      next: (data) => {
        this.obra = data;
      },
      error: (error) => {
        console.error('Error al cargar los equipos:', error);
      },
    });
  }
  loadMantenimientoData(id: number) {
    this.mantenimientoService.getMantenimientoById(id).subscribe({
      next: (data) => {
        this.mantenimiento = data; // Populate form with user data
        this.initializeForm(); // Initialize form after loading user data
      },
    });
  }

  initializeForm() {
    this.form = this.fb.group({
      fechaInicio: [this.mantenimiento.fechaInicio, Validators.required],
      fechaFin: [this.mantenimiento.fechaFin, Validators.required],
      estadoMantenimiento: [
        this.mantenimiento.estadoMantenimiento,
        Validators.required,
      ],
      tipoMantenimiento: [
        this.mantenimiento.tipoMantenimiento,
        Validators.required,
      ],
      detalleMantenimiento: [
        this.mantenimiento.detalleMantenimiento,
        Validators.required,
      ],
      responsable: [this.mantenimiento.responsable, Validators.required],
      equipo: [this.mantenimiento.equipo, Validators.required],
    });
    // Agregar el valor del equipo seleccionado al select
    const equipoSelect = this.form.get('equipo');
    if (equipoSelect) {
      equipoSelect.setValue(this.mantenimiento.equipo.id);
    }
  }

  // Manejar la selección de un equipo y actualizar el almacén y la obra asociados
  seleccionarEquipo(equipoId: string): void {
    const id = parseInt(equipoId, 10);
    const equipo = this.equipo.find((e) => e.id === id);
    if (equipo) {
      const almacenId = equipo.almacen.id;
      const almacen = this.almacen.find((a) => a.id === almacenId);
      if (almacen) {
        this.almacenSeleccionado = almacen.nombreAlmacen;
        const obraId = almacen.obra.id;
        const obra = this.obra.find((o) => o.id === obraId);
        if (obra) {
          this.obraSeleccionada = obra.nombreObra;
          const detalleMantenimientoControl = this.form.get(
            'detalleMantenimiento'
          );
          if (detalleMantenimientoControl) {
            const detalleMantenimiento = detalleMantenimientoControl.value;
            const texto = `Equipo: ${equipo.nombreEquipo}, Almacén: ${almacen.nombreAlmacen}, Obra: ${obra.nombreObra}`;
            detalleMantenimientoControl.setValue(
              detalleMantenimiento + '\n' + texto
            );
          }
        }
      }
    }
  }

  onSubmit(): void {
    if (this.form.valid) {
      const updatedMantenimiento: Mantenimiento = {
        id: this.mantenimiento.id,
        fechaInicio: this.form.value.fechaInicio,
        fechaFin: this.form.value.fechaFin,
        estadoMantenimiento: this.form.value.estadoMantenimiento,
        tipoMantenimiento: this.form.value.tipoMantenimiento,
        detalleMantenimiento: this.form.value.detalleMantenimiento,
        responsable: this.form.value.responsable,
        equipo: {
          id: this.form.value.equipo,
          nombreEquipo: this.form.value.nombreEquipo, // Este campo debe ser editable
          marca: this.form.value.marca,
          modelo: this.form.value.modelo,
          estadoEquipo: this.form.value.estadoEquipo,
          estadoUsoEquipo: this.form.value.estadoUsoEquipo,
          vidaUtil: this.form.value.vidaUtil, // Asegúrate de obtener este campo
          fechaAdquiscion: this.form.value.fechaAdquiscion,
          almacen: {
            id: this.form.value.almacen,
            nombreAlmacen: this.mantenimiento.equipo.almacen.nombreAlmacen, // Este campo puede mantenerse como estaba
            estadoAlmacen: this.mantenimiento.equipo.almacen.estadoAlmacen,
            obra: {
              id: this.mantenimiento.equipo.almacen.obra.id,
              nombreObra: this.mantenimiento.equipo.almacen.obra.nombreObra,
              ubicacionObra:
                this.mantenimiento.equipo.almacen.obra.ubicacionObra,
              estadoObra: this.mantenimiento.equipo.almacen.obra.estadoObra,
            },
          },
        },
      };

      this.mantenimientoService
        .editarMantenimiento(this.mantenimiento.id, updatedMantenimiento)
        .subscribe({
          next: () => {
            this.mensajeModal = 'Mantenimiento actualizado con éxito';
            this.manejarModal = true;
          },
          error: (err) => {
            this.errorModal = 'Error al actualizar el mantenimiento';
            this.manejarModal = true;
          },
        });
    }
  }
  manejarOk() {
    this.manejarModal = false;
    this.listarMantenimientoEditado.emit();
  }
}
