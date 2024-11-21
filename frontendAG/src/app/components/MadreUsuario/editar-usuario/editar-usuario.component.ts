import { Component, EventEmitter, Input, OnInit, Output, ViewChild, ElementRef } from '@angular/core';
import { UsuarioService } from '../services/usuario.service';
import { Obra, Usuario } from '../models/usuario';
import { CommonModule } from '@angular/common';
import {
  FormControl,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-editar-usuario',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './editar-usuario.component.html',
  styleUrls: ['./editar-usuario.component.css'],
})
export class EditarUsuarioComponent implements OnInit {
  usuario!: Usuario;
  obra: Obra[] = [];
  form!: FormGroup;
  successMessage: string = '';
  errorMessage: string = '';
  @Input() usuarioId: number | null = null;
  @Output() listarUsuarioEditado = new EventEmitter<void>();

  imagenPreview: string | ArrayBuffer | null = null;

  mensaje: string = '';
  esExito: boolean = false;

  manejarModal: boolean = false;
  mensajeModal: string = '';
  errorModal: string = '';

  ciNumero: string = '';
  departamentoAbreviatura: string = '';

  departamentos: string[] = [
    'SC',
    'LP',
    'CB',
    'OR',
    'PT',
    'TJ',
    'CH',
    'BE',
    'PD',
  ];

  private ciSubject = new Subject<string>();

  @ViewChild('fileInput', { static: false }) fileInput!: ElementRef; // Referencia al input de archivo

  constructor(private usuarioService: UsuarioService) {}

  ngOnInit(): void {
    this.loadObras();
    if (this.usuarioId !== null) {
      this.loadUserData(this.usuarioId);
    } else {
      console.error('Usuario Id is null or undefined');
    }
  }

  loadObras(): void {
    this.usuarioService.getObras().subscribe({
      next: (obra) => {
        this.obra = obra;
      },
    });
  }

  loadUserData(id: number) {
    this.usuarioService.getUserById(id).subscribe({
      next: (data) => {
        this.usuario = data;
        this.ciNumero = this.usuario.ci;
        this.departamentoAbreviatura = this.usuario.departamento;
        this.initializeForm();
        this.imagenPreview = this.usuario.imagen_url;
      },
    });
  }

  initializeForm() {
    this.form = new FormGroup({
      nombreUsuario: new FormControl(this.usuario.nombreUsuario, [
        Validators.required,
        Validators.pattern('^[a-zA-ZñÑáéíóúÁÉÍÓÚ ]+$'),
      ]),
      correo: new FormControl(this.usuario.correo, [
        Validators.required,
        Validators.email,
      ]),
      apellido: new FormControl(this.usuario.apellido, [
        Validators.required,
        Validators.pattern('^[a-zA-ZñÑáéíóúÁÉÍÓÚ ]+$'),
      ]),
      telefono: new FormControl(this.usuario.telefono),

      ci: new FormControl(this.ciNumero, [
        Validators.required,
        Validators.pattern('[0-9]{7,8}'),
        Validators.minLength(7),
        Validators.maxLength(8),
      ]),
      departamento: new FormControl(
        this.departamentoAbreviatura,
        Validators.required
      ),
      activo: new FormControl(this.usuario.activo),
      obra: new FormControl(this.usuario.obra?.id),
      imagen: new FormControl(null), // Inicializar el control de la imagen
    });
  }

  // Método para abrir el input de archivo manualmente
  triggerFileInput(): void {
    this.fileInput.nativeElement.click();
  }

  // Método para manejar el evento de arrastrar sobre el área de carga
  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
  }

  // Método para manejar el drop del archivo
  onDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();

    if (event.dataTransfer && event.dataTransfer.files.length > 0) {
      const file = event.dataTransfer.files[0];
      this.handleFile(file);
    }
  }

  // Método para manejar el cambio del input de archivo
  onImageChange(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.handleFile(file);
    }
  }

  // Método para procesar el archivo y mostrar la vista previa
  private handleFile(file: File): void {
    const reader = new FileReader();
    reader.onload = () => {
      this.imagenPreview = reader.result;
    };
    reader.readAsDataURL(file);
    this.form.patchValue({ imagen: file });
  }

  onSubmit(): void {
    if (this.form.valid) {
      const updatedUsuario: FormData = new FormData();
      updatedUsuario.append('id', this.usuario.id.toString());
      updatedUsuario.append('nombreUsuario', this.form.value.nombreUsuario);
      updatedUsuario.append('apellido', this.form.value.apellido);
      updatedUsuario.append('telefono', this.form.value.telefono);
      updatedUsuario.append('correo', this.form.value.correo);
      updatedUsuario.append('ci', this.form.value.ci);
      updatedUsuario.append('departamento', this.form.value.departamento);

      updatedUsuario.append(
        'activo',
        this.form.value.activo ? 'true' : 'false'
      ); // Asegúrate de que se envíe correctamente
      updatedUsuario.append(
        'obra',
        JSON.stringify({ id: this.form.value.obra })
      );

      if (this.form.value.imagen) {
        updatedUsuario.append('imagen', this.form.value.imagen);
      }

      this.usuarioService
        .editarUsuario(this.usuario.id, updatedUsuario)
        .subscribe({
          next: () => {
            this.mensajeModal = 'Usuario actualizado exitosamente';
            this.manejarModal = true;
          },
          error: () => {
            this.errorModal = 'Error al actualizar el usuario';
            this.manejarModal = true;
          },
        });
    }
  }

  manejarOk() {
    this.manejarModal = false;
    this.listarUsuarioEditado.emit();
  }

  validateNum(event: KeyboardEvent) {
    const inputChar = String.fromCharCode(event.keyCode);
    if (!/^[0-9]$/.test(inputChar)) {
      event.preventDefault();
    }
  }

  validateText(event: KeyboardEvent) {
    const inputChar = String.fromCharCode(event.keyCode);
    if (!/^[a-zA-Z ]+$/.test(inputChar)) {
      event.preventDefault();
    }
  }
}
