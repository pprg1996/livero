import { Ubicacion } from "features/ubicacion/types";

export type Repartidor = { activo: boolean; disponible: boolean; operaciones: Record<string, string> };