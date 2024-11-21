// mantenimiento.model.ts
export interface Obra {
  id: number;
  nombreObra: string;
  ubicacionObra: string;
  estadoObra: boolean;
}
export interface Almacen {
  id: number;
  nombreAlmacen: string;
  estadoAlmacen: boolean;
  obra: Obra;
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
export interface Mantenimiento {
  id: number;
  fechaInicio: Date;
  fechaFin: Date;
  detalleMantenimiento: string;
  responsable: string;
  tipo_mantenimiento: string; // true: preventivo, false: correctivo
  equipo: Equipo; // Asumimos que solo necesitamos la referencia del equipo por su ID
}
