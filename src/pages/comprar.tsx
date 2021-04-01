import { ChangeEventHandler, useContext, useState } from "react";
import "twin.macro";
import { globalContext } from "./_app";
import TiendaCarta from "features/compradores/TiendaCarta";
import { useCompradores, useUpdateUbicacion, useVendedores } from "features/firebase";
import { filtrarVendedorPorDistancia, filtrarVendedorPorHorario } from "shared/utils";
import { Ubicacion } from "features/ubicacion/types";
import { Tienda } from "features/tienda/types";

const Comprar = () => {
  const userUID = useContext(globalContext).state.user?.uid as string;
  const [distanciaMaxima, setDistanciaMaxima] = useState(5);

  useUpdateUbicacion("compradores");

  const vendedores = useVendedores();
  const compradores = useCompradores();
  const ubicacionPersonal = compradores?.[userUID as string]?.ubicacion;

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

  const handleDistanciaMaxima: ChangeEventHandler<HTMLInputElement> = e => {
    setDistanciaMaxima(Number(e.currentTarget.value));
  };

  return (
    <div tw="p-2 flex flex-col ">
      <h1 tw="text-2xl text-gray-700 mb-2">Tiendas en tu proximidad</h1>

      <div>
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
      </div>

      <span tw="font-medium text-gray-700">
        Costo de delivery maximo a esa distancia: ${Math.ceil(distanciaMaxima / 5)}
      </span>

      <div tw="px-4 py-2 flex gap-4 overflow-auto">
        {vendedoresAbiertosCercanos.map(([id, vendedor]) => {
          return <TiendaCarta key={id} tiendaId={id} vendedor={vendedor} />;
        })}
        <div tw="w-1 flex-shrink-0"></div>
      </div>
    </div>
  );
};

export default Comprar;
