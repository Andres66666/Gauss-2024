export interface Equipo {
  id: number;
  codigoEquipo: string; // Código único del equipo
  nombreEquipo: string; // Nombre del equipo
  marcaEquipo: string; // Marca del equipo
  modeloEquipo: string; // Modelo del equipo
  estadoEquipo: boolean; // Estado general del equipo, por defecto true
  estadoDisponibilidad: string; // Disponibilidad del equipo (e.g., "Disponible", "En uso")
  vidaUtilEquipo: string; // Vida útil del equipo en años u horas
  fechaAdquiscion: Date; // Fecha de adquisición del equipo
  fechaFabricacion?: Date; // Fecha de fabricación del equipo (opcional)
  horasUso: number; // Horas acumuladas de uso del equipo
  edadEquipo: string; // Calculado como la diferencia entre la fecha actual y la fecha de fabricación
  imagenEquipos_url?: string; // URL de la imagen del equipo (opcional)
  cantMantPreventivos: number; // Cantidad de mantenimientos preventivos realizados
  cantMantCorrectivos: number; // Cantidad de mantenimientos correctivos realizados
  numFallasReportdas: number; // Número de fallas reportadas
  almacen: Almacen; // Relación con el almacén específico
  almacen_global?: AlmacenGlobal; // Relación opcional con el almacén global
}

export interface Almacen {
  id: number;
  nombreAlmacen: string; // Nombre del almacén
  estadoAlmacen: boolean; // Estado del almacén (e.g., activo o inactivo)
  obra: Obra; // Relación con la obra correspondiente
}

export interface AlmacenGlobal {
  id: number;
  nombreAlmacen: string; // Nombre del almacén global
  estadoAlmacen: boolean; // Estado del almacén global
}

export interface Obra {
  id: number;
  nombreObra: string; // Nombre de la obra
  ubicacionObra: string; // Ubicación de la obra
  estadoObra: boolean; // Estado de la obra (e.g., activa o inactiva)
}
