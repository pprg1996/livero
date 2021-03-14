import { globalContext } from "pages/_app";
import { FC, useContext, useState } from "react";
import { Articulo } from "./types";
import firebase from "firebase/app";

const ArticuloCartaConDescripcion: FC<{ articulo: Articulo; id: string; editable?: boolean }> = ({
  articulo,
  id,
  editable,
}) => {
  const [mostrarDescripcion, setMostrarDescripcion] = useState(false);
  const userUID = useContext(globalContext).state.user?.uid;

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
          ) : (
            <button tw="text-white bg-blue-700 p-1 rounded text-xs">Meter al carrito</button>
          )}
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
