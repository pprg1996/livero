import { useCompradores, useFirebaseImg } from "features/firebase";
import { Tienda } from "features/tienda/types";
import Link from "next/link";
import { globalContext } from "pages/_app";
import { FC, useContext } from "react";
import { capitalizeFirstLetter, distanciaEntreUbicaciones } from "shared/utils";

const TiendaCarta: FC<{ vendedor: Tienda; tiendaId: string }> = ({ vendedor, tiendaId }) => {
  const userUID = useContext(globalContext).state.user?.uid;
  const { imgUrl: bannerImgUrl } = useFirebaseImg(tiendaId, "banner");
  const { imgUrl: profileImgUrl } = useFirebaseImg(tiendaId, "profile");
  const compradores = useCompradores();

  let distancia = 0;

  if (compradores) {
    distancia = distanciaEntreUbicaciones(vendedor.ubicacion, compradores[userUID as string].ubicacion);
  }

  let tiposDeProductos: string[] = [];
  Object.entries(vendedor.menu.articulos).forEach(([id, articulo]) => {
    tiposDeProductos.push(articulo.tipo);
  });

  tiposDeProductos = Array.from(new Set(tiposDeProductos));

  return (
    <Link href={`/tiendas/${tiendaId}`} passHref>
      <a data-zzz="zzz" tw="p-4 shadow min-w-full">
        <div tw="aspect-w-7 aspect-h-3">
          <img src={bannerImgUrl} tw="object-cover" />
        </div>

        <div tw="flex items-center justify-between px-4 -mt-6 mb-4">
          <div tw="w-16 rounded overflow-hidden ">
            <div tw="aspect-w-1 aspect-h-1">
              <img src={profileImgUrl} tw="object-cover" />
            </div>
          </div>

          <h2 tw="mt-4 text-gray-700 font-medium">{vendedor.titulo}</h2>
        </div>

        <div tw="grid grid-cols-2 grid-auto-rows[auto] place-items-center gap-2">
          {tiposDeProductos.map(tipo => (
            <span key={tipo} tw="bg-gray-300 p-1 rounded">
              {capitalizeFirstLetter(tipo)}
            </span>
          ))}

          <span tw="border-gray-700 border-2 font-medium p-1 rounded">{distancia} Km</span>
        </div>
      </a>
    </Link>
  );
};

export default TiendaCarta;
