export interface Solicitudes {
  id: number;
  codigoSolicitud: string;
  fecha_solicitud: Date;
  fecha_retorno_estimada: Date;
  fecha_retorno_real?: string | null; // Cambiar a string
  estado: 'pendiente' | 'completada' | 'cancelada' | 'En uso';
  motivo_uso?: string | null;
  fecha_uso: Date;
  equipo: Equipo;
  usuario: Usuario;
  descripcion_falla?: string | null;
  cantidad_fallas_solicitud: number;
  horas_uso_solicitud: number;
}
export interface Equipo {
  id: number;
  codigoEquipo: string;
  nombreEquipo: string;
  marcaEquipo: string;
  modeloEquipo: string;
  estadoEquipo: boolean;
  estadoDisponibilidad: string;
  vidaUtilEquipo: string;
  fechaAdquiscion: Date;
  fechaFabricacion: Date;
  horasUso: number;
  edadEquipo: string;
  imagenEquipos_url: string;
  cantMantPreventivos: number;
  cantMantCorrectivos: number;
  numFallasReportdas: number;
  almacen: Almacen;
}

export interface Almacen {
  id: number;
  nombreAlmacen: string;
  estadoAlmacen: boolean;
  obra: Obra;
}

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
  departamento: string;
  fecha_creacion: Date;
  activo: boolean;
  obra: Obra;
  imagen: string;
  imagen_url: string;
}
