import { useVendedores } from "features/firebase";
import ArticuloCarta from "features/menu/ArticuloCarta";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { useEffect, useState } from "react";
import { capitalizeFirstLetter } from "shared/utils";

const TipoArticuloPage = ({ tipo, vendedorId, categoria }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(categoria);
  const vendedores = useVendedores();

  console.log(categoriaSeleccionada);

  let categorias: string[] = [];

  if (vendedores) {
    categorias = vendedores[vendedorId].menu.categorias;
  }

  return (
    <div tw="p-2 space-y-2">
      <div tw="flex space-x-2 items-center">
        <h1 tw="text-lg font-medium text-gray-700">{capitalizeFirstLetter(tipo)}</h1>

        <span>-</span>

        <label>
          Categoria:
          <select
            value={categoriaSeleccionada || undefined}
            onChange={e => setCategoriaSeleccionada(e.currentTarget.value)}
            tw="border rounded ml-1"
          >
            {categorias.map(cat => (
              <option value={cat}>{capitalizeFirstLetter(cat)}</option>
            ))}
          </select>
        </label>
      </div>

      <div tw="rounded shadow p-2">{/* <ArticuloCartaConDescripcion /> */}</div>
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
