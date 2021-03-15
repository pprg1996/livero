import { useVendedores } from "features/firebase";
import ArticuloCarta from "features/menu/ArticuloCarta";
import ArticuloCartaConDescripcion from "features/menu/ArticuloCartaConDescripcion";
import { Articulo } from "features/menu/types";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { useEffect, useState } from "react";
import { capitalizeFirstLetter } from "shared/utils";

const TipoArticuloPage = ({ tipo, vendedorId, categoria }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(categoria?.toLowerCase());
  const vendedores = useVendedores();

  let categorias: string[] = [];
  let articulosDeCategoria: [id: string, articulo: Articulo][] = [];

  if (vendedores) {
    categorias = vendedores[vendedorId].menu.categorias;

    Object.entries(vendedores[vendedorId].menu.articulos).forEach(([id, articulo]) => {
      if (articulo.categoria === categoriaSeleccionada) articulosDeCategoria.push([id, articulo]);
    });
  }

  useEffect(() => {
    if (!categorias.includes(categoriaSeleccionada ?? "") && categorias.length > 0) {
      setCategoriaSeleccionada(categorias[0]);
    }
  });

  return (
    <div tw="p-2 space-y-2">
      <div tw="flex space-x-2 items-center">
        <h1 tw="text-lg font-medium text-gray-700">{capitalizeFirstLetter(tipo)}</h1>

        <span>-</span>

        <label>
          Categoria:
          <select
            value={categoriaSeleccionada}
            onChange={e => setCategoriaSeleccionada(e.currentTarget.value)}
            tw="border rounded ml-1"
          >
            {categorias.map(cat => (
              <option key={cat} value={cat}>
                {capitalizeFirstLetter(cat)}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div tw="rounded shadow p-2 flex flex-col items-center space-y-2">
        {articulosDeCategoria.map(([id, articulo]) => (
          <ArticuloCartaConDescripcion key={id} vendedorId={vendedorId} id={id} articulo={articulo} />
        ))}
      </div>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps<{
  vendedorId: string;
  tipo: string;
  categoria: string | null;
}> = async context => {
  return {
    props: {
      vendedorId: context.query.vendedorId as string,
      tipo: context.query.tipoArticulo as string,
      categoria: (context.query.categoria as string) ?? null,
    },
  };
};

export default TipoArticuloPage;
