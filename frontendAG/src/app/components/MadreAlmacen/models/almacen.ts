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
  estadoObra: true;
}
