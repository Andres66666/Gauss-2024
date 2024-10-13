// mantenimiento.model.ts

export interface Obra {
  id: number;
  nombreObra: string;
  ubicacionObra: string;
  estadoObra: true;
}
export interface Almacen {
  id: number;
  nombreAlmacen: string;
  estadoAlmacen: true;
  obra: Obra;
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
export interface Mantenimiento {
  id: number;
  fechaInicio: Date;
  fechaFin: Date;
  estadoMantenimiento: true;
  tipoMantenimiento: string; // true: preventivo, false: correctivo
  detalleMantenimiento: string;
  responsable: string;
  equipo: Equipo; // Asumimos que solo necesitamos la referencia del equipo por su ID
}
