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
