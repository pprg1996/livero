import { Calificacion } from "features/tienda/types";

export type Articulo = {
  titulo: string;
  descripcion: string;
  precio: number;
  imgUrl: string;
  categoria: string;
  moneda: string;
  tipo: "comida" | "vestimenta" | "medicina" | "tecnologia" | "hogar" | "herramienta";
  calificaciones?: Record<string, Calificacion>;
};

export type ArticuloId = string;

export type Menu = { categorias: string[]; articulos: Record<ArticuloId, Articulo> };
