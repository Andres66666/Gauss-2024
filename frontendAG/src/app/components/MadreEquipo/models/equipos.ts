// equipo.ts
export interface Equipo {
  id: number; // Este campo es opcional si es generado automáticamente por el backend
  nombreEquipo: string;
  marca: string;
  modelo: string;
  estadoEquipo: boolean;
  estadoUsoEquipo: 'Disponible' | 'En uso' | 'En mantenimiento'; // Usando un tipo de unión para las opciones
  vidaUtil: string; // Puede ser 'años' o 'horas'
  fechaAdquiscion: string; // Usa string o Date según tu preferencia
  almacen: Almacen; // O puedes usar el tipo Almacenes si ya has definido la interfaz
  imagenEquipos: string;
  imagenEquipos_url: string;
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
