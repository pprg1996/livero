import CarritoDrawer from "features/compradores/CarritoDrawer";
import { Carrito, CompraStatus, Operacion } from "features/compradores/types";
import { Articulo } from "features/menu/types";
import firebase from "firebase";
import { useContext, useEffect, useState } from "react";
import "twin.macro";
import { globalContext } from "./_app";
import CartSvg from "../assets/icons/shopping-cart.svg";
import TiendaCarta from "features/compradores/TiendaCarta";

const Comprar = () => {
  const [carrito, setCarrito] = useState<Carrito>();
  const [operacion, setOperacion] = useState<Operacion>();
  const [compraStatus, setCompraStatus] = useState<CompraStatus>("explorando");
  const userUID = useContext(globalContext).user?.uid;
  const [tiendaId, setTiendaId] = useState<string>();
  const [repartidorId, setRepartidorId] = useState<string>();
  const [showCarrito, setShowCarrito] = useState(false);

  const meterArticuloAlCarrito = (articulo: Articulo, articuloId: string) => {
    let newCarrito: Carrito;

    if (carrito === undefined) {
      newCarrito = { articuloPacks: [{ articulo, articuloId, cantidad: 1 }] };
    } else {
      newCarrito = { ...carrito };

      const articuloPack = newCarrito.articuloPacks.find(ap => {
        return ap.articuloId === articuloId;
      });

      if (articuloPack) {
        articuloPack.cantidad++;
      } else newCarrito.articuloPacks.push({ articulo, cantidad: 1, articuloId });
    }

    firebase.database().ref(`compradores/${userUID}/carrito`).set(newCarrito);
  };

  useEffect(() => {
    firebase
      .database()
      .ref(`/compradores/${userUID}/carrito`)
      .on("value", data => setCarrito(data.val()));
  }, []);

  return (
    <div tw="bg-gray-200 py-2">
      <button tw="ml-auto" onClick={() => setShowCarrito(s => !s)}>
        <CartSvg tw="text-gray-700 transform -scale-x-1" fill="currentColor" />
      </button>

      {showCarrito ? <CarritoDrawer setCompraStatus={setCompraStatus} /> : null}

      <div tw="bg-white py-2">
        <h1 tw="text-2xl text-gray-700 ml-4 mb-2">Tiendas cerca de ti</h1>

        <div tw="px-4 py-2 flex gap-4 overflow-auto">
          <TiendaCarta />
          <TiendaCarta />
          <div tw="w-1 flex-shrink-0"></div>
        </div>
      </div>
    </div>
  );
};

export default Comprar;
