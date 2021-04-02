import { globalContext } from "pages/_app";
import { FC, useContext, useState } from "react";
import { Articulo } from "./types";
import firebase from "firebase/app";
import { useCompradores, useVendedores } from "features/firebase";
import { meterArticuloAlCarrito } from "shared/utils";
import Link from "next/link";
import CalificacionPromedio from "features/calificaciones/CalificacionPromedio";

const ArticuloCartaConDescripcion: FC<{
  articulo: Articulo;
  id: string;
  editable?: boolean;
  vendedorId?: string;
  vendedorNombre?: string;
}> = ({ articulo, id, editable, vendedorId, vendedorNombre }) => {
  const [mostrarDescripcion, setMostrarDescripcion] = useState(false);
  const userUID = useContext(globalContext).state.user?.uid as string;
  const carrito = useCompradores()?.[userUID]?.carritos?.[vendedorId as string];
  const enCarrito = carrito?.articuloPacks.some(ap => ap.articuloId === id);
  const calificaciones = useVendedores()?.[vendedorId ?? userUID].menu.articulos[id].calificaciones;

  const eliminarArticulo = () => {
    if (!confirm("¿Seguro que desea borrar el artículo?")) return;

    firebase.storage().refFromURL(articulo.imgUrl).delete();
    firebase.database().ref(`/tiendas/${userUID}/menu/articulos/${id}`).remove();
  };

  return (
    <div tw="rounded border p-2 space-x-2">
      <img src={articulo.imgUrl} tw="w-64 h-64 object-contain" />

      <div tw="py-2 flex flex-col">
        <div tw="flex justify-between items-center">
          <span tw="font-medium text-gray-700">{articulo.titulo}</span>

          {editable ? (
            <button onClick={eliminarArticulo} tw="text-red-700 border-2 border-red-700 p-1 rounded text-xs">
              Eliminar
            </button>
          ) : !enCarrito ? (
            <button
              onClick={() => meterArticuloAlCarrito(articulo, id, userUID, vendedorId as string, carrito)}
              tw="text-white bg-blue-700 p-1 rounded text-xs mt-1"
            >
              Meter al carrito
            </button>
          ) : null}
        </div>

        <div tw="flex justify-between items-center">
          <span tw="text-gray-700">${articulo.precio}</span>
          {vendedorNombre ? (
            <Link href={`/tiendas/${vendedorId}`} passHref>
              <a tw="text-gray-700 underline my-2">{vendedorNombre}</a>
            </Link>
          ) : null}
        </div>

        <CalificacionPromedio calificaciones={calificaciones} />

        <button onClick={() => setMostrarDescripcion(s => !s)} tw="bg-blue-700 text-white rounded p-1 my-2 text-sm">
          Descripción: {mostrarDescripcion ? "Ocultar" : "Mostrar"}
        </button>
        {mostrarDescripcion ? <span tw="w-64">{articulo.descripcion}</span> : null}
      </div>
    </div>
  );
};

export default ArticuloCartaConDescripcion;
