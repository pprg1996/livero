import { useCompradores } from "features/firebase";
import Link from "next/link";
import { globalContext } from "pages/_app";
import { FC, useContext } from "react";
import { capitalizeFirstLetter, meterArticuloAlCarrito } from "shared/utils";
import { Articulo } from "./types";

const ArticuloCarta: FC<{ articulo: Articulo; id: string; vendedorId: string; tipo: string }> = ({
  articulo,
  vendedorId,
  tipo,
  id,
}) => {
  const userUID = useContext(globalContext).state.user?.uid as string;
  const carrito = useCompradores()?.[userUID]?.carritos?.[vendedorId];

  const enCarrito = carrito?.articuloPacks.some(ap => ap.articuloId === id);

  return (
    <div tw="rounded border p-2 flex space-x-2 flex-shrink-0">
      <img src={articulo.imgUrl} tw="w-40 h-40 object-contain" />

      <div tw="py-2 flex flex-col">
        <span tw="font-medium text-gray-700">{articulo.titulo}</span>
        <span tw="text-gray-700">${articulo.precio}</span>

        {!enCarrito ? (
          <button
            onClick={() => meterArticuloAlCarrito(articulo, id, userUID, vendedorId, carrito)}
            tw="text-white bg-blue-700 p-1 rounded text-xs mt-1"
          >
            Meter al carrito
          </button>
        ) : null}

        <Link href={`/tiendas/${vendedorId}/${tipo}?categoria=${articulo.categoria.toLowerCase()}`}>
          <a tw="text-gray-700 px-1.5 mt-auto underline">{capitalizeFirstLetter(articulo.categoria)}</a>
        </Link>
      </div>
    </div>
  );
};

export default ArticuloCarta;
