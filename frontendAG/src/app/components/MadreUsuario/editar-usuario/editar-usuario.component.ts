import { Component, Input, OnInit } from '@angular/core';
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
  imagenPreview: string | ArrayBuffer | null = null;

  mensaje: string = '';
  esExito: boolean = false;
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
    this.ciSubject.pipe(debounceTime(500)).subscribe((ci) => {
      this.validateCI(ci);
    });
  }

  loadObras(): void {
    this.usuarioService.getObras().subscribe({
      next: (obra) => {
        this.obra = obra;
      },
      error: (error) => {
        console.error('Error al cargar las obras:', error);
      },
    });
  }

  loadUserData(id: number) {
    this.usuarioService.getUserById(id).subscribe({
      next: (data) => {
        this.usuario = data;
        this.processCI(this.usuario.ci);
        this.initializeForm();
        this.imagenPreview = this.usuario.imagen_url;
      },
      error: (error) => {
        this.errorMessage = 'Error al cargar los datos del usuario.';
        console.error('Error loading user data:', error);
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
      obra: new FormControl(this.usuario.obra.id, Validators.required),
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
      const ci = this.form.get('ci')?.value;
      const departamento = this.form.get('departamento')?.value;
      updatedUsuario.append('ci', `${ci} ${departamento}`); // Combinar CI y departamento

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

        if (correoExiste) {
          this.errorMessage = 'El correo electrónico ya existe';
        } else if (telefonoExiste) {
          this.errorMessage = 'El teléfono ya existe';
        } else {
          // Editar usuario
          this.usuarioService
            .editarUsuario(this.usuario.id, updatedUsuario)
            .subscribe({
              next: () => {
                this.mensaje = 'Usuario actualizado exitosamente';
                this.esExito = true;
                setTimeout(() => {
                  window.location.reload();
                }, 2000);
              },
              error: (err) => {
                this.errorMessage =
                  'Error al actualizar el usuario. Por favor, intenta nuevamente.';
                console.error('Error al actualizar el usuario:', err);
              },
            });
        }
      });
    } else {
      this.errorMessage =
        'El formulario no es válido. Por favor, revisa los campos.';
    }
  }

  private usuariosCargados = false;

  onCIChange(ci: string) {
    this.ciSubject.next(ci);
  }
  validateCI(ci: string) {
    if (this.usuarioId === null) {
      // Si es un nuevo registro
      // Realizar la validación del CI
      if (!this.usuariosCargados) {
        this.usuariosCargados = true;
        // Verificar si el CI ya existe en la base de datos
        this.usuarioService.getUsuarios().subscribe((usuarios) => {
          const usuarioConCI = usuarios.find((usuario) => usuario.ci === ci);
          if (usuarioConCI) {
            this.form.get('ci')?.setErrors({ 'ci-existe': true });
          } else {
            this.form.get('ci')?.setErrors(null);
          }
          this.usuariosCargados = false;
        });
      }
    } else {
      // Si es un usuario existente
      const ci = this.form.get('ci')?.value;
      const departamento = this.form.get('departamento')?.value;
      const ciCompleto = `${ci} ${departamento}`;

      if (
        ciCompleto !== this.usuario.ci ||
        departamento !== this.departamentoAbreviatura
      ) {
        // Si el CI o el departamento ha cambiado
        // Realizar la validación del CI
        if (!this.usuariosCargados) {
          this.usuariosCargados = true;
          // Verificar si el CI ya existe en la base de datos
          this.usuarioService.getUsuarios().subscribe((usuarios) => {
            const usuarioConCI = usuarios.find(
              (usuario) =>
                usuario.ci === ciCompleto && usuario.id !== this.usuario.id
            );
            if (usuarioConCI) {
              this.form.get('ci')?.setErrors({ 'ci-existe': true });
            } else {
              this.form.get('ci')?.setErrors(null);
            }
            this.usuariosCargados = false;
          });
        }
      } else {
        // No realizar la validación del CI
        this.form.get('ci')?.setErrors(null);
      }
    }
  }
  processCI(ci: string) {
    const ciParts = ci.split(' ');
    if (ciParts.length === 2) {
      this.ciNumero = ciParts[0];
      this.departamentoAbreviatura = ciParts[1];
    } else {
      this.ciNumero = ci;
      this.departamentoAbreviatura = '';
    }
  }
}
