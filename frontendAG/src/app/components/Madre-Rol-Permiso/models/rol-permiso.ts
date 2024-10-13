export interface Rol {
  id: number;
  nombreRol: string;
  activo: boolean; // Agrega esta propiedad si es necesaria
}

export interface Permiso {
  id: number;
  nombre: string;
  descripcion: string;
  activo: boolean; // Agrega esta propiedad si es necesaria
}

export interface RolPermiso {
  id: number;
  rol: Rol;
  permiso: Permiso;
}
