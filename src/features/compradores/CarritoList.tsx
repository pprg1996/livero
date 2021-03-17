import distance from "@turf/distance";
import { ArticuloPack, Carrito } from "features/compradores/types";
import { useCompradores, useOperaciones, useVendedores } from "features/firebase";
import { globalContext } from "pages/_app";
import { FC, useContext } from "react";
import PlusSvg from "../../assets/icons/plus.svg";
import MinusSvg from "../../assets/icons/minus.svg";
import firebase from "firebase/app";

const CarritoList: FC<{ vendedorId: string; carrito: Carrito }> = ({ vendedorId, carrito }) => {
  const userUID = useContext(globalContext).state.user?.uid as string;
  const compradores = useCompradores();
  const vendedores = useVendedores();

  let distanciaDelivery = 0;
  let costoDelivery = 0;
  let costoCarrito = 0;

  const compradorUbicacion = compradores?.[userUID].ubicacion;
  const vendedorUbicacion = vendedores?.[vendedorId].ubicacion;

  distanciaDelivery = Number(
    distance(
      [compradorUbicacion?.longitud ?? 0, compradorUbicacion?.latitud ?? 0],
      [vendedorUbicacion?.longitud ?? 0, vendedorUbicacion?.latitud ?? 0],
      {
        units: "kilometers",
      },
    ).toFixed(2),
  );

  costoDelivery = Math.ceil(Number((distanciaDelivery / 5).toFixed(2)));

  costoCarrito =
    carrito?.articuloPacks.reduce((precio, articuloPack) => {
      return (precio += articuloPack.cantidad * articuloPack.articulo.precio);
    }, 0) ?? 0;

  return (
    <div tw="space-y-2">
      {carrito?.articuloPacks.map(articuloPack => {
        return (
          <CarritoItem
            key={articuloPack.articuloId}
            articuloPack={articuloPack}
            carrito={carrito}
            vendedorId={vendedorId}
          />
        );
      })}

      <h1 tw="text-lg">
        Delivery: {distanciaDelivery}Km = ${costoDelivery}
      </h1>

      <h1 tw="text-lg font-medium text-gray-700">Total: ${(costoCarrito + costoDelivery).toFixed(2)}</h1>
    </div>
  );
};

const CarritoItem: FC<{ articuloPack: ArticuloPack; vendedorId: string; carrito: Carrito }> = ({
  articuloPack,
  carrito,
  vendedorId,
}) => {
  const { titulo, imgUrl, moneda, precio } = articuloPack.articulo;
  const userUID = useContext(globalContext).state.user?.uid;

  const sumarRestarCantidad = (operacion: "sumar" | "restar") => {
    const newCarrito: Carrito = { ...carrito };

    const tempAP = newCarrito.articuloPacks.find(ap => ap.articuloId === articuloPack.articuloId);

    if (tempAP) {
      if (tempAP.cantidad - 1 === 0 && operacion === "restar") return;

      operacion === "sumar" ? tempAP.cantidad++ : tempAP.cantidad--;
    }

    setTimeout(() => {
      firebase.database().ref(`/compradores/${userUID}/carritos/${vendedorId}`).set(carrito);
    }, 100);
  };

  return (
    <div tw="flex items-start space-x-2">
      <img src={imgUrl} tw="object-contain w-24 h-24" />

      <div tw="mt-2">
        <div tw="flex space-x-2">
          <h2 tw="font-medium">{titulo}</h2>
          <span>
            {moneda === "dolares" ? "$" : "Bs"}
            {precio}
          </span>
        </div>

        <div tw="flex items-center space-x-2">
          <span>Cantidad:</span>

          {articuloPack.cantidad > 1 ? (
            <button onClick={() => sumarRestarCantidad("restar")}>
              <MinusSvg tw="w-5 h-auto" />
            </button>
          ) : null}

          <span tw="text-xl text-gray-700">{articuloPack.cantidad}</span>
          <button onClick={() => sumarRestarCantidad("sumar")}>
            <PlusSvg tw="w-5 h-auto" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CarritoList;
