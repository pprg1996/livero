import Link from "next/link";
import { FC, useState } from "react";
import { Articulo } from "./types";

const ArticuloCartaConDescripcion: FC<{ articulo: Articulo; id: string }> = ({ articulo, id }) => {
  const [mostrarDescripcion, setMostrarDescripcion] = useState(false);

  return (
    <div tw="rounded border p-2 space-x-2">
      <img src={articulo.imgUrl} tw="w-64 h-64 object-contain" />

      <div tw="py-2 flex flex-col">
        <div tw="flex justify-between items-center">
          <span tw="font-medium text-gray-700">{articulo.titulo}</span>
          <button tw="text-white bg-blue-700 p-1 rounded text-xs">Meter al carrito</button>
        </div>

        <span tw="text-gray-700">${articulo.precio}</span>

        <button onClick={() => setMostrarDescripcion(s => !s)} tw="bg-blue-700 text-white rounded p-1 my-2 text-sm">
          Descripción: {mostrarDescripcion ? "Ocultar" : "Mostrar"}
        </button>
        {mostrarDescripcion ? <span tw="w-64">{articulo.descripcion}</span> : null}
      </div>
    </div>
  );
};

export default ArticuloCartaConDescripcion;
