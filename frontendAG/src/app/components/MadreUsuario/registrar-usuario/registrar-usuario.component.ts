import { Component } from '@angular/core';
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

  mensaje: string = '';
  esExito: boolean = false;

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

  constructor(
    private fb: FormBuilder,
    private usuarioService: UsuarioService,
    private router: Router
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
          Validators.pattern('[0-9]{8,9}'),
          Validators.minLength(8),
          Validators.maxLength(9),
        ],
      ],
      departamento: ['', Validators.required], // Agregar este control
      obra: ['', Validators.required], // Relación con una obra
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
      const ci = this.registrarForm.get('ci')?.value;
      const departamento = this.registrarForm.get('departamento')?.value;
      formData.append('ci', `${ci} ${departamento}`); // Combinar CI y departamento
      formData.append('obra', this.registrarForm.get('obra')?.value);
      formData.append('fecha_creacion', new Date().toISOString()); // Fecha actual
      formData.append('activo', 'true'); // Por defecto activo

      // Si se seleccionó una imagen, añadirla a formData
      const imagenInput = this.registrarForm.get('imagen')?.value;
      if (imagenInput) {
        // Validar el tamaño de la imagen
        if (imagenInput.size > 1024 * 1024 * 5) {
          // 5MB
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
          (usuario) => usuario.ci === `${ci} ${departamento}` // Combinar CI y departamento
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
                this.mensaje = 'Registro de usuario exitoso';
                this.esExito = true;
                setTimeout(() => {
                  window.location.reload();
                }, 2000);
              },
              (error) => {
                console.error('Error al registrar usuario', error);
              }
            );
        }
      });
    }
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
    }
  }
  /* validaciones  */
  validateNombreUsuario(event: KeyboardEvent) {
    const inputChar = String.fromCharCode(event.keyCode); // Obtener el carácter ingresado
    // Validar si el carácter ingresado no es una letra ni un espacio
    if (!/^[a-zA-Z ]+$/.test(inputChar)) {
      event.preventDefault(); // Evitar que el carácter se ingrese
    }
  }
  validateApellido(event: KeyboardEvent) {
    const inputChar = String.fromCharCode(event.keyCode); // Obtener el carácter ingresado
    // Validar si el carácter ingresado no es una letra ni un espacio
    if (!/^[a-zA-Z ]+$/.test(inputChar)) {
      event.preventDefault(); // Evitar que el carácter se ingrese
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
    // Validar la longitud del CI
    if (currentInput.length > 9) {
      event.preventDefault(); // Evitar que se ingrese más de 9 caracteres
    }
  }

  validateDepartamento(event: KeyboardEvent) {
    const inputChar = String.fromCharCode(event.keyCode); // Obtener el carácter ingresado
    // Aceptar solo letras mayúsculas
    if (!/^[A-Z]+$/.test(inputChar)) {
      event.preventDefault(); // Evitar que se ingrese el carácter
    }
  }
}
