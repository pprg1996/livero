import CalificacionPromedio from "features/calificaciones/CalificacionPromedio";
import { useFirebaseImg, useFirebaseTiendaTitulo, useVendedores } from "features/firebase";
import ArticuloCarta from "features/menu/ArticuloCarta";
import { Articulo } from "features/menu/types";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import Image from "next/image";
import Link from "next/link";
import { FC } from "react";
import { capitalizeFirstLetter } from "shared/utils";

const Tienda = ({ vendedorId }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const { imgUrl: bannerImgUrl } = useFirebaseImg(vendedorId, "banner");
  const { imgUrl: profileImgUrl } = useFirebaseImg(vendedorId, "profile");
  const { titulo } = useFirebaseTiendaTitulo(vendedorId);

  const vendedores = useVendedores();
  const calificaciones = vendedores?.[vendedorId].calificaciones;

  let articulosPorTipo: Record<Articulo["tipo"], [string, Articulo][]> = {
    comida: [],
    vestimenta: [],
    medicina: [],
    tecnologia: [],
    hogar: [],
    herramienta: [],
  };

  if (vendedores) {
    Object.entries(vendedores[vendedorId]?.menu?.articulos ?? {}).forEach(([id, articulo]) => {
      articulosPorTipo[articulo.tipo].push([id, articulo]);
    });
  }

  return (
    <div tw="flex flex-col pb-2">
      <div className="banner-img" tw="flex bg-gray-500 relative">
        <Image src={bannerImgUrl} width={640} height={274} objectFit="contain" />
      </div>

      <div className="profile-img" tw="flex flex-col -mt-8 ml-8 self-start">
        <Image src={profileImgUrl} width={82} height={82} objectFit="contain" tw="rounded" />
      </div>

      <div className="titulo" tw="-mt-10 mb-8 ml-32 flex items-center">
        <h1 tw="font-medium text-lg">{titulo}</h1>

        <div tw="ml-auto mr-12">
          <CalificacionPromedio calificaciones={calificaciones} />
        </div>
      </div>

      <div tw="rounded shadow p-3 space-y-4">
        {Object.entries(articulosPorTipo).map(([tipo, listaDeTipo]) => (
          <MenuListConTipo vendedorId={vendedorId} listaDeTipo={listaDeTipo} tipo={tipo} key={tipo} />
        ))}
      </div>
    </div>
  );
};

const MenuListConTipo: FC<{ tipo: string; listaDeTipo: [string, Articulo][]; vendedorId: string }> = ({
  tipo,
  listaDeTipo,
  vendedorId,
}) => {
  if (listaDeTipo.length === 0) return null;

  return (
    <div>
      <h1 tw="text-lg font-medium text-gray-700">{capitalizeFirstLetter(tipo)}</h1>

      <div tw="flex space-x-2 overflow-auto">
        {listaDeTipo.slice(0, 3).map(([id, articulo]) => (
          <ArticuloCarta vendedorId={vendedorId} key={id} articulo={articulo} id={id} tipo={tipo} />
        ))}

        <Link href={`/tiendas/${vendedorId}/${tipo}`} passHref>
          <a tw="border rounded p-2 flex items-center justify-center w-56 flex-shrink-0 font-medium text-gray-700">
            Ver mas
          </a>
        </Link>
      </div>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps<{
  vendedorId: string;
}> = async context => {
  return { props: { vendedorId: context.query.vendedorId as string } };
};

export default Tienda;
