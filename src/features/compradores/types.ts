import { Articulo } from "features/menu/types";

export type ArticuloPack = {
  articulo: Articulo;
  articuloId: string;
  cantidad: number;
};

export type Carrito = { articuloPacks: ArticuloPack[] };

export type Mensaje = { texto: string; rol: "comprador" | "vendedor" | "repartidor" };

export type CompraStatus = "explorando" | "pagando" | "repartiendo";

export type Operacion = {
  carrito: Carrito;
  tiendaId: string;
  compradorId: string;
  repartidorId?: string;
  mensajes?: Mensaje[];
  status: "pagando" | "repartiendo" | "finalizado" | "cancelado";
  fecha: number;
};

export type Comprador = { operaciones: Record<string, string> };
