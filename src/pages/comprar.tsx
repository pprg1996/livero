import CarritoDrawer from "features/compradores/CarritoDrawer";
import { Carrito, CompraStatus, Operacion } from "features/compradores/types";
import { Articulo } from "features/menu/types";
import firebase from "firebase";
import { ChangeEventHandler, useContext, useEffect, useState } from "react";
import "twin.macro";
import { globalContext } from "./_app";
import CartSvg from "../assets/icons/shopping-cart.svg";
import TiendaCarta from "features/compradores/TiendaCarta";
import { useCompradores, useOperacionesPersonales, useUpdateUbicacion, useVendedores } from "features/firebase";
import { filtrarVendedorPorDistancia, filtrarVendedorPorHorario } from "shared/utils";
import { Ubicacion } from "features/ubicacion/types";
import { Tienda } from "features/tienda/types";

const Comprar = () => {
  const [carrito, setCarrito] = useState<Carrito>();
  const [operacion, setOperacion] = useState<Operacion>();
  const [compraStatus, setCompraStatus] = useState<CompraStatus>("explorando");
  const userUID = useContext(globalContext).state.user?.uid;
  const [tiendaId, setTiendaId] = useState<string>();
  const [repartidorId, setRepartidorId] = useState<string>();
  const [showCarrito, setShowCarrito] = useState(false);
  const [distanciaMaxima, setDistanciaMaxima] = useState(5);

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

  const operaciones = useOperacionesPersonales("compradores");

  useUpdateUbicacion("compradores");

  const vendedores = useVendedores();
  const compradores = useCompradores();
  const ubicacionPersonal = compradores?.[userUID as string].ubicacion;

  let vendedoresAbiertosCercanos: [string, Tienda][] = [];

  if (vendedores && compradores) {
    vendedoresAbiertosCercanos = Object.entries(vendedores).filter(([, vendedor]) => {
      return (
        filtrarVendedorPorHorario(vendedor) &&
        filtrarVendedorPorDistancia(distanciaMaxima, vendedor, ubicacionPersonal as Ubicacion) &&
        vendedor.activo
      );
    });
  }

  useEffect(() => {
    firebase
      .database()
      .ref(`/compradores/${userUID}/carrito`)
      .on("value", data => setCarrito(data.val()));
  }, []);

  const handleDistanciaMaxima: ChangeEventHandler<HTMLInputElement> = e => {
    setDistanciaMaxima(Number(e.currentTarget.value));
  };

  return (
    <div tw="p-2">
      {/* <button tw="ml-auto" onClick={() => setShowCarrito(s => !s)}>
        <CartSvg tw="text-gray-700 transform -scale-x-1" fill="currentColor" />
      </button> */}
      {/* {showCarrito ? <CarritoDrawer setCompraStatus={setCompraStatus} /> : null} */}
      {/* <div tw="bg-white py-2"> */}

      <span tw="font-medium text-gray-700">Distancia maxima: </span>
      <input
        tw="border rounded w-12"
        type="number"
        step={1}
        min={1}
        value={distanciaMaxima}
        onChange={handleDistanciaMaxima}
      />
      <span>Km</span>

      <h1 tw="text-2xl text-gray-700 mb-2">Tiendas en tu proximidad</h1>
      <div tw="px-4 py-2 flex gap-4 overflow-auto">
        {vendedoresAbiertosCercanos.map(([id, vendedor]) => {
          return <TiendaCarta key={id} tiendaId={id} vendedor={vendedor} />;
        })}
        <div tw="w-1 flex-shrink-0"></div>
      </div>
      {/* </div> */}
    </div>
  );
};

export default Comprar;
