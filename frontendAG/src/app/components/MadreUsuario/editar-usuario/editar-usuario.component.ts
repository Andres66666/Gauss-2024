import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
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
        Validators.pattern('[0-9]{8,9}'),
        Validators.minLength(8),
        Validators.maxLength(9),
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

  onImageChange(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.imagenPreview = reader.result; // Set image preview
      };
      reader.readAsDataURL(file);
      this.form.patchValue({ imagen: file });
    }
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

      // Verificar datos a enviar
      console.log('Datos a enviar:', updatedUsuario);

      // Validar si el correo electrónico y el nombre de usuario ya existen
      this.usuarioService.getUsuarios().subscribe((usuarios) => {
        const correoExiste = usuarios.find(
          (usuario) =>
            usuario.correo === this.form.value.correo &&
            usuario.id !== this.usuario.id
        );

        const telefonoExiste = usuarios.find(
          (usuario) =>
            usuario.telefono === this.form.value.telefono &&
            usuario.id !== this.usuario.id
        );
        const ciExiste = usuarios.find(
          (usuario) =>
            usuario.ci === this.form.value.ci && usuario.id !== this.usuario.id
        );

        if (correoExiste) {
          this.errorMessage = 'El correo electrónico ya existe';
        } else if (telefonoExiste) {
          this.errorMessage = 'El teléfono ya existe';
        } else if (ciExiste) {
          this.errorMessage = 'El C.I. ya Existe';
        } else {
          // Editar usuario
          this.usuarioService
            .editarUsuario(this.usuario.id, updatedUsuario)
            .subscribe({
              next: () => {
                this.mensajeModal = 'Usuario actualizado exitosamente'; // Mensaje para el modal
                this.manejarModal = true; // Mostrar el modal
              },
              error: (err) => {
                this.errorModal = 'Error al actualizar el usuario';
                this.manejarModal = true;
              },
            });
        }
      });
    }
  }
  manejarOk() {
    this.manejarModal = false; // Cerrar el modal
    this.listarUsuarioEditado.emit(); // Emitir el evento para listar usuarios
  }
  validateNum(event: KeyboardEvent) {
    const inputChar = String.fromCharCode(event.keyCode);
    // Aceptar solo números
    if (!/^[0-9]$/.test(inputChar)) {
      event.preventDefault();
    }
  }
  validateText(event: KeyboardEvent) {
    const inputChar = String.fromCharCode(event.keyCode); 
    // Validar si el carácter ingresado no es una letra ni un espacio
    if (!/^[a-zA-Z ]+$/.test(inputChar)) {
      event.preventDefault();
    }
  }
}
