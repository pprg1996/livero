import { Comprador, Operacion } from "features/compradores/types";
import { useCompradores, useFirebaseImg, useOperaciones, useRepartidores, useVendedores } from "features/firebase";
import { Repartidor } from "features/repartidores/types";
import { Tienda } from "features/tienda/types";
import { useRouter } from "next/router";
import { globalContext } from "pages/_app";
import { FC, useContext } from "react";

const PerfilesOperacion = () => {
  const router = useRouter();
  const operacionChatId = useContext(globalContext).state.operacionChatId as string;
  const operaciones = useOperaciones();
  const operacionChat = operaciones?.[operacionChatId];

  const { compradorId, tiendaId, repartidorId } = operacionChat
    ? operacionChat
    : { compradorId: "", tiendaId: "", repartidorId: "" };

  const comprador = useCompradores()?.[compradorId];
  const vendedor = useVendedores()?.[tiendaId];

  const repartidores = useRepartidores();
  const repartidor = repartidorId ? repartidores?.[repartidorId] : undefined;

  return (
    <div tw="space-y-2">
      {comprador && router.pathname !== "/chatcomprador" ? (
        <PerfilCarta tipo="compradores" perfil={comprador} id={compradorId} />
      ) : null}

      {vendedor && router.pathname !== "/chatvendedor" ? (
        <PerfilCarta tipo="tiendas" perfil={vendedor} id={tiendaId} />
      ) : null}

      {repartidor && router.pathname !== "/chatrepartidor" ? (
        <PerfilCarta tipo="repartidores" perfil={repartidor} id={repartidorId as string} />
      ) : null}
    </div>
  );
};

type Props =
  | {
      tipo: "compradores";
      perfil: Comprador;
      id: string;
    }
  | {
      tipo: "tiendas";
      perfil: Tienda;
      id: string;
    }
  | {
      tipo: "repartidores";
      perfil: Repartidor;
      id: string;
    };

const PerfilCarta: FC<Props> = ({ tipo, perfil, id }) => {
  const { imgUrl } = useFirebaseImg(id, "profile", tipo);
  let nombre = "";

  if (tipo === "compradores" || tipo === "repartidores") {
    nombre = perfil.nombre;
  } else {
    nombre = perfil.titulo;
  }

  return (
    <div>
      <img src={imgUrl} tw="w-52 h-52 object-contain" />
      <span tw="text-gray-700 font-medium">
        {tipo === "compradores"
          ? "Comprador: "
          : tipo === "tiendas"
          ? "Vendedor: "
          : tipo === "repartidores"
          ? "Repartidor: "
          : ""}
        {nombre}
      </span>
    </div>
  );
};

export default PerfilesOperacion;
