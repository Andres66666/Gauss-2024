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
