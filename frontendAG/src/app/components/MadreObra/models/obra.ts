export interface Obra {
  id: number;
  nombreObra: string;
  ubicacionObra: string;
  estadoObra: boolean;
  fecha_creacion_obra?: Date; // opcional, será asignada automáticamente en el backend
  fecha_cierre_obra?: string | null; // este campo es opcional y no se muestra en el formulario
  fecha_desactivacion?: Date; // Almacenar la fecha de desactivación
}
