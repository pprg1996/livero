import { Horario } from "features/horario/types";
import { Menu } from "features/menu/types";
import { MetodosDePago } from "features/pagos/types";
import { Ubicacion } from "features/ubicacion/types";

export type Calificacion = { timestamp: number; estrellas: number; critica: string | null };

export type Tienda = {
  activo: boolean;
  abierto: boolean;
  horario: Horario;
  menu: Menu;
  titulo: string;
  ubicacion: Ubicacion;
  operaciones: Record<string, string>;
  notificacionesEnOperaciones?: Record<string, boolean>;
  pagosNuevosEnOperaciones?: Record<string, boolean>;
  metodosDePago: MetodosDePago;
  calificaciones?: Record<string, Calificacion>;
};
