import { useOperaciones } from "features/firebase";
import { useRouter } from "next/router";
import { globalContext } from "pages/_app";
import { useContext } from "react";
import { capitalizeFirstLetter } from "shared/utils";
import firebase from "firebase/app";
import { Operacion } from "features/compradores/types";
import tw from "twin.macro";

const StatusOperacion = () => {
  const operacionChatId = useContext(globalContext).state.operacionChatId as string;
  const operaciones = useOperaciones();
  const operacionChatSeleccionada = operaciones?.[operacionChatId];
  const status = operacionChatSeleccionada?.status;
  const router = useRouter();

  const marcarComoPagado = () => {
    const nuevoStatus: Operacion["status"] = "repartiendo";

    setTimeout(() => {
      firebase.database().ref(`operaciones/${operacionChatId}/status`).set(nuevoStatus);
    }, 500);
  };

  const marcarComoEntregado = () => {
    const nuevoStatus: Operacion["status"] = "finalizado";

    setTimeout(() => {
      firebase.database().ref(`operaciones/${operacionChatId}/status`).set(nuevoStatus);
    }, 500);
  };

  return (
    <div tw="flex flex-col space-y-2">
      <span tw="border-2 border-gray-700 font-medium rounded text-gray-700 p-1.5 self-start">
        {capitalizeFirstLetter(status ?? "")}
      </span>

      {router.pathname === "/chatvendedor" && status === "pagando" ? (
        <button onClick={marcarComoPagado} tw="bg-blue-700 p-1.5 rounded text-white">
          Marcar como pagado
        </button>
      ) : null}

      {router.pathname === "/chatcomprador" && status === "repartiendo" ? (
        <button onClick={marcarComoEntregado} tw="bg-blue-700 p-1.5 rounded text-white">
          Marcar como entregado
        </button>
      ) : null}
    </div>
  );
};

export default StatusOperacion;
