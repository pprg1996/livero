export type Articulo = {
  id: number;
  titulo: string;
  descripcion: string;
  precio: number;
  imgUrl: string;
  categoria: string;
  moneda: string;
};

export type Menu = { categorias: string[]; articulos: Articulo[] };
