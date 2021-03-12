import distance from "@turf/distance";
import { ArticuloPack } from "features/compradores/types";
import { useCompradores, useOperaciones, useVendedores } from "features/firebase";
import { globalContext } from "pages/_app";
import { FC, useContext } from "react";

const CarritoOperacion = () => {
  const operacionChatId = useContext(globalContext).state.operacionChatId as string;
  const operacionSeleccionada = useOperaciones()?.[operacionChatId];
  const carrito = operacionSeleccionada?.carrito;

  const compradores = useCompradores();
  const vendedores = useVendedores();

  let distanciaDelivery = 0;
  let costoDelivery = 0;
  let costoCarrito = 0;

  if (operacionSeleccionada) {
    const compradorUbicacion = compradores?.[operacionSeleccionada?.compradorId].ubicacion;
    const vendedorUbicacion = vendedores?.[operacionSeleccionada?.tiendaId].ubicacion;

    distanciaDelivery = Number(
      distance(
        [compradorUbicacion?.longitud ?? 0, compradorUbicacion?.latitud ?? 0],
        [vendedorUbicacion?.longitud ?? 0, vendedorUbicacion?.latitud ?? 0],
        {
          units: "kilometers",
        },
      ).toFixed(2),
    );

    costoDelivery = Number((distanciaDelivery / 5).toFixed(2));

    costoCarrito =
      carrito?.articuloPacks.reduce((precio, articuloPack) => {
        return (precio += articuloPack.cantidad * articuloPack.articulo.precio);
      }, 0) ?? 0;
  }

  return (
    <div>
      {carrito?.articuloPacks.map(articuloPack => {
        return <CarritoItem key={articuloPack.articuloId} articuloPack={articuloPack} />;
      })}

      <h1 tw="text-lg">
        Delivery: {distanciaDelivery}Km = ${costoDelivery}
      </h1>

      <h1 tw="text-lg font-medium text-gray-700">Total: ${(costoCarrito + costoDelivery).toFixed(2)}</h1>
    </div>
  );
};

const CarritoItem: FC<{ articuloPack: ArticuloPack }> = ({ articuloPack }) => {
  const { titulo, imgUrl, moneda, precio } = articuloPack.articulo;

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

        <span>Cantidad: {articuloPack.cantidad}</span>
      </div>
    </div>
  );
};

export default CarritoOperacion;
