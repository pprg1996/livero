import { Articulo } from "features/menu/types";
import { Ubicacion } from "features/ubicacion/types";

export type ArticuloPack = {
  articulo: Articulo;
  articuloId: string;
  cantidad: number;
};

export type Carrito = { articuloPacks: ArticuloPack[] };

export type Mensaje = { texto: string; rol: "comprador" | "vendedor" | "repartidor"; timestamp: number };

export type CompraStatus = "explorando" | "pagando" | "repartiendo";

export type Pagos = {
  vendedor: { zelle: string; pm: string; paypal: string };
  repartidor: { zelle: string; pm: string; paypal: string };
};

export type CalificacionesEnviadas = {
  vendedor: boolean;
  repartidor: boolean;
  articulos?: Record<string, boolean>;
};

export type Operacion = {
  carrito: Carrito;
  tiendaId: string;
  compradorId: string;
  repartidorId?: string;
  mensajes?: Record<string, Mensaje>;
  status: "pagando" | "repartiendo" | "finalizado" | "cancelado";
  timestamp: number;
  pagos: Pagos;
  calificacionesEnviadas: CalificacionesEnviadas;
};

type vendedorId = string;

export type Comprador = {
  operaciones: Record<string, string>;
  nombre: string;
  ubicacion: Ubicacion;
  carritos?: Record<vendedorId, Carrito>;
  notificacionesEnOperaciones?: Record<string, boolean>;
};
