import { ChangeEventHandler, useContext, useEffect, useState } from "react";
import "twin.macro";
import { globalContext } from "./_app";
import TiendaCarta from "features/compradores/TiendaCarta";
import { useCompradores, useUpdateUbicacion, useVendedores } from "features/firebase";
import { filtrarVendedorPorDistancia, filtrarVendedorPorHorario } from "shared/utils";
import { Ubicacion } from "features/ubicacion/types";
import { Tienda } from "features/tienda/types";
import { Articulo } from "features/menu/types";
import Fuse from "fuse.js";
import ArticuloCartaConDescripcion from "features/menu/ArticuloCartaConDescripcion";

const Comprar = () => {
  const userUID = useContext(globalContext).state.user?.uid as string;
  const [distanciaMaxima, setDistanciaMaxima] = useState(5);
  const [busqueda, setBusqueda] = useState<string>();
  const [resultadoBusqueda, setResultadoBusqueda] = useState<
    Fuse.FuseResult<{
      articulo: Articulo;
      articuloId: string;
      vendedorId: string;
      vendedor: Tienda;
    }>[]
  >([]);

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

  const buscar = () => {
    const terminoABuscar = (document.getElementById("buscador") as HTMLInputElement).value;

    const articulosDeBusqueda: { articulo: Articulo; articuloId: string; vendedorId: string; vendedor: Tienda }[] = [];

    for (let [vendedorId, vendedor] of vendedoresAbiertosCercanos) {
      Object.entries(vendedor.menu.articulos).forEach(([articuloId, articulo]) =>
        articulosDeBusqueda.push({ articulo, articuloId, vendedorId, vendedor }),
      );
    }

    setResultadoBusqueda(
      new Fuse(articulosDeBusqueda, {
        keys: ["articulo.titulo", "articulo.descripcion", "articulo.tipo", "articulo.categoria", "vendedor.titulo"],
      }).search(terminoABuscar),
    );

    setBusqueda(terminoABuscar);
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

      {/* <span tw="font-medium text-gray-700">
        Costo de delivery maximo a esa distancia: ${Math.ceil(distanciaMaxima / 5)}
      </span> */}

      <div tw="max-w-xs mx-auto space-x-2">
        <input id="buscador" type="text" tw="border rounded p-1 mt-2" placeholder="Buscar" />
        <button onClick={buscar} tw="bg-blue-700 rounded text-xs text-white p-1">
          Buscar
        </button>
      </div>

      {!busqueda ? (
        <div tw="px-4 py-2 flex gap-4 overflow-auto">
          {vendedoresAbiertosCercanos.map(([id, vendedor]) => {
            return <TiendaCarta key={id} tiendaId={id} vendedor={vendedor} />;
          })}
          <div tw="w-1 flex-shrink-0"></div>
        </div>
      ) : (
        <div tw="flex flex-col items-center mt-3">
          {resultadoBusqueda.map(({ item: { articulo, articuloId, vendedorId, vendedor } }) => {
            return (
              <ArticuloCartaConDescripcion
                key={articuloId}
                id={articuloId}
                articulo={articulo}
                vendedorId={vendedorId}
                vendedorNombre={vendedor.titulo}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Comprar;
