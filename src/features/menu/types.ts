export type Articulo = {
  titulo: string;
  descripcion: string;
  precio: number;
  imgUrl: string;
  categoria: string;
  moneda: string;
  tipo: string;
};

export type ArticuloId = string;

export type Menu = { categorias: string[]; articulos: Record<ArticuloId, Articulo> };
