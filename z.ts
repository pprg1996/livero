export interface Articulo {
  titulo: string;
  descripcion: string;
  precio: number;
  imgUrl: string;
  categoria: string;
  moneda: string;
  tipo: "comida" | "vestimenta" | "medicina" | "tecnologia" | "hogar" | "herramienta";
}

// export type ArticuloId = string;

export interface Menu {
  categorias: string[];
  articulos: Record<string, Articulo>;
}

export interface ArticuloPack {
  articulo: Articulo;
  articuloId: string;
  cantidad: number;
}

export interface Carrito {
  articuloPacks: ArticuloPack[];
}

export interface Mensaje {
  texto: string;
  rol: "comprador" | "vendedor" | "repartidor";
  timestamp: number;
}

export type CompraStatus = "explorando" | "pagando" | "repartiendo";

export interface Operacion {
  carrito: Carrito;
  tiendaId: string;
  compradorId: string;
  repartidorId?: string;
  mensajes?: Record<string, Mensaje>;
  status: "pagando" | "repartiendo" | "finalizado" | "cancelado";
  timestamp: number;
}

// export type vendedorId = string;

export interface Ubicacion {
  longitud: number;
  latitud: number;
}

export interface Comprador {
  operaciones: Record<string, string>;
  nombre: string;
  ubicacion: Ubicacion;
  carritos?: Record<string, Carrito>;
}

export interface Repartidor {
  activo: boolean;
  disponible: boolean;
  operaciones: Record<string, string>;
  operacionPendienteId?: string;
  ubicacion: Ubicacion;
  nombre: string;
}

export interface Dia {
  horaApertura: string;
  horaCierre: string;
  isAbierto: boolean;
}

export type TipoHorario = "manual" | "automatico";

export interface Horario {
  tipo: TipoHorario;
  dias: { lunes: Dia; martes: Dia; miercoles: Dia; jueves: Dia; viernes: Dia; sabado: Dia; domingo: Dia };
}

export interface Tienda {
  activo: boolean;
  abierto: boolean;
  horario: Horario;
  menu: Menu;
  titulo: string;
  ubicacion: Ubicacion;
  operaciones: Record<string, string>;
}

export interface BaseDeDatos {
  compradores: Record<string, Comprador>;
  repartidores: Record<string, Repartidor>;
  tiendas: Record<string, Tienda>;
  operaciones: Record<string, Operacion>;
}

// File System -----------------------------------------------------------------------------------------------

/* 
TIENDAS
Foto de articulo - /imagenes/tiendas/${id}/menu/articulos/${id}
Foto de perfil - /imagenes/tiendas/${id}/profile/${timestamp}
Foto de banner - /imagenes/tiendas/${id}/banner/${timestamp}

REPARTIDORES
Foto de perfil - /imagenes/repartidores/${id}/profile/${timestamp}

COMPRADORES
Foto de perfil - /imagenes/compradores/${id}/profile/${timestamp}
*/
