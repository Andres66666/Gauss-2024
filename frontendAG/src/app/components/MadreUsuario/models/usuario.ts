export interface Obra {
  id: number;
  nombreObra: string;
  ubicacionObra: string;
  estadoObra: true;
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
  activo: true;
  obra: Obra;
  imagen: string;
  imagen_url: string;
}
