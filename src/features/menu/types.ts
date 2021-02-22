export type Articulo = {
  titulo: string;
  descripcion: string;
  precio: number;
  imgUrl: string;
  categoria: string;
  moneda: string;
  tipo: string;
};

export type Menu = { categorias: string[]; articulos: Articulo[] };
