export interface Solicitudes {
  id: number;
  fechaSolicitud: Date;
  fechaRetornoEstimada: Date;
  fechaRetornoReal: Date;
  equipo: Equipo;
  obra: Obra;
  usuario: Usuario;
}
export interface Equipo {
  id: number; // Este campo es opcional si es generado automáticamente por el backend
  nombreEquipo: string;
  marca: string;
  modelo: string;
  estadoEquipo: true;
  estadoUsoEquipo: 'Disponible' | 'En uso' | 'En mantenimiento'; // Usando un tipo de unión para las opciones
  vidaUtil: string; // Puede ser 'años' o 'horas'
  fechaAdquiscion: string; // Usa string o Date según tu preferencia
  almacen: Almacen; // O puedes usar el tipo Almacenes si ya has definido la interfaz
}
export interface Almacen {
  id: number;
  nombreAlmacen: string;
  estadoAlmacen: true;
  obra: Obra;
}
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
