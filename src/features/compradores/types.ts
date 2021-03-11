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

export type Operacion = {
  carrito: Carrito;
  tiendaId: string;
  compradorId: string;
  repartidorId?: string;
  mensajes?: Record<string, Mensaje>;
  status: "pagando" | "repartiendo" | "finalizado" | "cancelado";
  timestamp: number;
};

export type Comprador = { operaciones: Record<string, string>; nombre: string; ubicacion: Ubicacion };
