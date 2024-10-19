export interface Obra {
  id: number;
  nombreObra: string;
  ubicacionObra: string;
  estadoObra: boolean;
}

export interface Usuario {
  id: number;
  nombreUsuario: string;
  apellido: string;
  telefono: string;
  correo?: string;
  password?: string;
  ci: string;
  fecha_creacion: Date;
  activo: boolean;
  obra: Obra;
  imagen: string;
  imagen_url: string;
}
