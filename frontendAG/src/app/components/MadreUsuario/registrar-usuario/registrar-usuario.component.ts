import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Obra, Usuario } from '../models/usuario'; // Asegúrate de que la ruta sea correcta
import { UsuarioService } from '../services/usuario.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-registrar-usuario',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './registrar-usuario.component.html',
  styleUrl: './registrar-usuario.component.css',
})
export class RegistrarUsuarioComponent {
  registrarForm: FormGroup;
  obras: Obra[] = [];
  submitted = false;

  esExito: boolean = false;
  mensaje: string = '';

  manejarModal: boolean = false;
  mensajeModal: string = '';
  errorModal: string = '';

  @Output() listarUsuario = new EventEmitter<void>();

  departmentAbbreviations = [
    'LP',
    'CB',
    'SC',
    'PT',
    'OR',
    'TG',
    'CH',
    'BN',
    'PD',
  ];
  // Array temporal para simular la base de datos
  existingCIs: string[] = [];

  constructor(
    private fb: FormBuilder,
    private usuarioService: UsuarioService,
    private router: Router,
    private http: HttpClient
  ) {
    this.registrarForm = this.fb.group({
      nombreUsuario: [
        '',
        [Validators.required, Validators.pattern('^[a-zA-Z ]+$')],
      ],
      apellido: ['', [Validators.required, Validators.pattern('^[a-zA-Z ]+$')]],
      telefono: [
        '',
        [Validators.required, Validators.pattern('^[67][0-9]{7}$')],
      ],
      correo: [
        '',
        [
          Validators.required, // El campo es obligatorio
          Validators.email, // Validación del formato de correo
        ],
      ],
      password: [
        '',
        [
          Validators.required, // El campo es obligatorio
          Validators.minLength(8), // Mínimo 8 caracteres
          Validators.pattern(
            '^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*]).+$'
          ), // Validación de requisitos
        ],
      ],
      ci: [
        '',
        [
          Validators.required,
          Validators.pattern('[0-9]{7,8}'),
          Validators.minLength(7),
          Validators.maxLength(8),
        ],
      ],
      departamento: ['', Validators.required], // Agregar este control
      obra: [''], // Relación con una obra
      imagen: [''], // Para cargar la imagen
    });
  }
  ngOnInit(): void {
    this.loadObras();
  }
  loadObras() {
    this.usuarioService.getObras().subscribe((data) => {
      this.obras = data;
    });
  }

  // Registrar usuario con manejo de imagen
  registrarUsuario() {
    if (this.registrarForm.valid) {
      const formData = new FormData(); // Usar FormData para incluir la imagen y los datos

      // Añadir cada campo del formulario al formData
      formData.append(
        'nombreUsuario',
        this.registrarForm.get('nombreUsuario')?.value
      );
      formData.append('apellido', this.registrarForm.get('apellido')?.value);
      formData.append('telefono', this.registrarForm.get('telefono')?.value);
      formData.append('correo', this.registrarForm.get('correo')?.value || '');
      formData.append(
        'password',
        this.registrarForm.get('password')?.value || ''
      );
      formData.append('ci', this.registrarForm.get('ci')?.value); // Solo el número de CI
      formData.append(
        'departamento',
        this.registrarForm.get('departamento')?.value
      ); // Ahora separado
      formData.append('obra', this.registrarForm.get('obra')?.value);
      formData.append('fecha_creacion', new Date().toISOString()); // Fecha actual
      formData.append('activo', 'true'); // Por defecto activo

      // Si se seleccionó una imagen, añadirla a formData
      // Check if an image is uploaded
      const imagenInput = this.registrarForm.get('imagen')?.value;
      if (imagenInput) {
          // Validate and add uploaded image
          formData.append('imagen', imagenInput);
      } 

      // Validar si el correo electrónico y el nombre de usuario ya existen
      this.usuarioService.getUsuarios().subscribe((usuarios) => {
        const correoExiste = usuarios.find(
          (usuario) =>
            usuario.correo === this.registrarForm.get('correo')?.value
        );
        const telefonoExiste = usuarios.find(
          (usuario) =>
            usuario.telefono === this.registrarForm.get('telefono')?.value
        );
        const ciExiste = usuarios.find(
          (usuario) => usuario.ci === this.registrarForm.get('ci')?.value // Solo el número de CI
        );

        if (correoExiste) {
          this.mensaje = 'El correo electrónico ya existe';
          this.esExito = false;
        } else if (telefonoExiste) {
          this.mensaje = 'El teléfono ya existe';
          this.esExito = false;
        } else if (ciExiste) {
          this.mensaje = 'La cédula de identidad ya existe';
          this.esExito = false;
        } else {
          // Registrar usuario
          this.usuarioService
            .registrarUsuario(formData as unknown as Usuario)
            .subscribe(
              (response) => {
                this.mensajeModal = 'Registro de usuario exitoso'; // Mensaje para el modal
                this.manejarModal = true; // Mostrar el modal
                this.esExito = true; // Indicar éxito
              },
              (error) => {
                this.errorModal = 'Error al registrar usuario';
                this.manejarModal = true;
              }
            );
        }
      });
    }
  }
  manejarOk() {
    this.manejarModal = false; // Cerrar el modal
    this.listarUsuario.emit(); // Emitir el evento para listar usuarios
  }

  imagenPreview: string | ArrayBuffer | null = null;
  // Manejar la selección de archivo
  onFileChange(event: any): void {
    if (event.target.files.length > 0) {
        const file = event.target.files[0];
        this.registrarForm.patchValue({
            imagen: file,
        });
        const reader = new FileReader();
        reader.onload = (e) => {
            this.imagenPreview = reader.result;
        };
        reader.readAsDataURL(file);
    } else {
        // Use default image for preview
        this.imagenPreview = 'https://localimg.s3.us-east-2.amazonaws.com/imagenes/pph.png';
    }
}
  /* validaciones  */
  validateText(event: KeyboardEvent) {
    const inputChar = String.fromCharCode(event.keyCode);
    // Validar si el carácter ingresado no es una letra ni un espacio
    if (!/^[a-zA-Z ]+$/.test(inputChar)) {
      event.preventDefault();
    }
  }
  validateTelefono(event: KeyboardEvent) {
    const inputChar = String.fromCharCode(event.keyCode); // Obtener el carácter ingresado
    const currentInput = (event.target as HTMLInputElement).value;
    // Validar si el carácter ingresado no es un número o si ya hay 8 dígitos en el campo
    if (!/^[0-9]$/.test(inputChar) || currentInput.length >= 8) {
      event.preventDefault(); // Evitar que se ingrese el carácter
    }
    // Validar que el primer dígito sea 6 o 7
    if (currentInput.length === 0 && !/^[67]$/.test(inputChar)) {
      event.preventDefault(); // Evitar que se ingrese el primer dígito si no es 6 o 7
    }
  }
  isPasswordVisible = false; // Propiedad para controlar la visibilidad de la contraseña
  // Método para alternar la visibilidad de la contraseña
  togglePasswordVisibility() {
    this.isPasswordVisible = !this.isPasswordVisible;
  }
  validatePassword(event: KeyboardEvent) {
    const inputChar = String.fromCharCode(event.keyCode); // Obtener el carácter ingresado
    // Validar si el carácter ingresado no es una letra, número o un carácter especial permitido
    if (!/^[a-zA-Z0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/? ]+$/.test(inputChar)) {
      event.preventDefault(); // Evitar que el carácter se ingrese
    }
  }
  validateCI(event: KeyboardEvent) {
    const inputChar = String.fromCharCode(event.keyCode); // Obtener el carácter ingresado
    const currentInput = (event.target as HTMLInputElement).value;

    // Aceptar solo números
    if (!/^[0-9]$/.test(inputChar)) {
      event.preventDefault(); // Evitar que se ingrese el carácter
    }
    // Validar la longitud del CI (máximo 9 caracteres)
    if (currentInput.length >= 9) {
      event.preventDefault(); // Evitar que se ingrese más de 9 caracteres
    }
  }
  
  triggerFileInput() {
    const fileInput = document.querySelector('#imagen') as HTMLInputElement;
    fileInput.click();
  }
  
  onDragOver(event: DragEvent) {
    event.preventDefault();
  }
  
  onDrop(event: DragEvent) {
    event.preventDefault();
    const file = event.dataTransfer?.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.imagenPreview = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }
  

}
