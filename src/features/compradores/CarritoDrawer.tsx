import { useContext, useState } from "react";
import { Carrito, Operacion } from "./types";
import ReactDOM from "react-dom";
import { globalContext } from "pages/_app";
import firebase from "firebase/app";

const carritoDefault = {
  articuloPacks: [
    {
      articuloId: "-MUhxOZhWw6hHb-3ThUA",
      cantidad: 2,
      articulo: {
        categoria: "Hamburguesas",
        descripcion: "Es una rica hamburguesa",
        imgUrl:
          "https://firebasestorage.googleapis.com/v0/b/livero-337cb.appspot.com/o/imagenes%2Ftiendas%2FLZsH8MawYMVivP4ybiZU7EpSwkz2%2Fmenu%2Farticulos%2F-MUhxOZhWw6hHb-3ThUA?alt=media&token=628001d6-f91a-4642-8e37-e419da8ad2b8",
        moneda: "dolares",
        precio: 1,
        tipo: "comida",
        titulo: "Hamburguesa",
      },
    },
  ],
};

const CarritoDrawer = ({ setCompraStatus }: { setCompraStatus: Function }) => {
  const [carrito, setCarrito] = useState<Carrito>(carritoDefault);
  const [tiendaId, setTiendaId] = useState("LZsH8MawYMVivP4ybiZU7EpSwkz2");
  const userUID = useContext(globalContext).user?.uid;

  const procederAPagar = () => {
    if (!tiendaId || !userUID || !carrito) return;

    const newOperacion: Operacion = {
      carrito,
      compradorId: userUID,
      tiendaId: tiendaId,
      status: "pagando",
      timestamp: Date.now(),
    };

    setCompraStatus("pagando");
    const operacionId = firebase.database().ref(`/operaciones`).push(newOperacion).key;

    firebase.database().ref(`tiendas/${tiendaId}/operaciones`).push(operacionId);
    firebase.database().ref(`compradores/${userUID}/operaciones`).push(operacionId);
  };

  if (typeof window === "undefined") {
    return null;
  }

  return ReactDOM.createPortal(
    <div tw="bg-gray-700 bg-opacity-40 w-full h-full absolute z-10 flex justify-end right-0 top-0">
      <div tw="bg-white border w-32 h-32 min-height[90vh] border-gray-700 border-solid">
        <h1>{carrito.articuloPacks[0].articulo.titulo}</h1>

        <button onClick={procederAPagar}>Proceder a pagar</button>
      </div>
    </div>,
    document.getElementById("content-container") as HTMLElement,
  );
};

export default CarritoDrawer;
