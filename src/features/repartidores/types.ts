import { MetodosDePago } from "features/pagos/types";
import { Calificacion } from "features/tienda/types";
import { Ubicacion } from "features/ubicacion/types";

export type Repartidor = {
  activo: boolean;
  disponible: boolean;
  operaciones?: Record<string, string>;
  operacionPendienteId?: string;
  ubicacion: Ubicacion;
  nombre: string;
  notificacionesEnOperaciones?: Record<string, boolean>;
  pagosNuevosEnOperaciones?: Record<string, boolean>;
  metodosDePago: MetodosDePago;
  calificaciones?: Record<string, Calificacion>;
};
