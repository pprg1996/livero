import { Horario } from "features/horario/types";
import { Menu } from "features/menu/types";
import { Ubicacion } from "features/ubicacion/types";

export type Tienda = {
  activo: boolean;
  abierto: boolean;
  horario: Horario;
  menu: Menu;
  titulo: string;
  ubicacion: Ubicacion;
};