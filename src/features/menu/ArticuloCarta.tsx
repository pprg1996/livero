import Link from "next/link";
import { FC } from "react";
import { Articulo } from "./types";

const ArticuloCarta: FC<{ articulo: Articulo; id: string; vendedorId: string; tipo: string }> = ({
  articulo,
  vendedorId,
  tipo,
}) => {
  return (
    <div tw="rounded border p-2 flex space-x-2 flex-shrink-0">
      <img src={articulo.imgUrl} tw="w-40 h-40 object-contain" />

      <div tw="py-2 flex flex-col">
        <span tw="font-medium text-gray-700">{articulo.titulo}</span>
        <span tw="text-gray-700">${articulo.precio}</span>

        <Link href={`/tiendas/${vendedorId}/${tipo}?categoria=${articulo.categoria.toLowerCase()}`}>
          <a tw="text-gray-700 px-1.5 mt-auto underline">{articulo.categoria}</a>
        </Link>
      </div>
    </div>
  );
};

export default ArticuloCarta;
