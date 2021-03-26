import { FC, useContext, useEffect, useState } from "react";
import firebase from "firebase/app";
import { capitalizeFirstLetter } from "shared/utils";
import { Operacion } from "features/compradores/types";
import { Actions, globalContext } from "pages/_app";
import SobreSvg from "../../assets/icons/sobre.svg";

const CartaChatBtn: FC<{
  id: string;
  tipo: "compradores" | "tiendas" | "repartidores";
  operacion: Operacion;
  hayNotificacion: boolean;
}> = ({ id, operacion, tipo, hayNotificacion }) => {
  const [nombreComprador, setNombreComprador] = useState("");
  const [nombreVendedor, setNombreVendedor] = useState("");
  const [nombreRepartidor, setNombreRepartidor] = useState("");

  const dispatch = useContext(globalContext).dispatch;

  const { compradorId, tiendaId, repartidorId, status } = operacion;

  useEffect(() => {
    const nombreCompradorRef = firebase.database().ref(`/compradores/${compradorId}/nombre`);
    const nombreVendedorRef = firebase.database().ref(`/tiendas/${tiendaId}/titulo`);
    const nombreRepartidorRef = firebase.database().ref(`/repartidores/${repartidorId}/nombre`);

    nombreCompradorRef.on("value", data => setNombreComprador(data.val()));
    nombreVendedorRef.on("value", data => setNombreVendedor(data.val()));
    nombreRepartidorRef.on("value", data => setNombreRepartidor(data.val()));

    return () => {
      nombreCompradorRef.off();
      nombreVendedorRef.off();
      nombreRepartidorRef.off();
    };
  }, [repartidorId]);

  return (
    <button
      tw="shadow p-3 space-y-4 flex flex-col"
      onClick={() => dispatch({ type: Actions.SET_OPERACION_CHAT_ID, payload: id })}
    >
      <div tw="space-x-2 self-stretch flex items-center">
        <span tw="bg-gray-700 border-2 border-gray-700 text-white py-1 px-2 rounded">Operacion: {id.slice(-4)}</span>
        <span tw="border-2 border-gray-700 text-gray-700 py-1 px-2 rounded">
          Status: {capitalizeFirstLetter(status)}
        </span>
        {hayNotificacion ? <SobreSvg tw="w-6 h-auto ml-auto!" /> : null}
      </div>

      {tipo !== "compradores" ? (
        <span tw="bg-blue-700 border-2 border-blue-700 text-white py-1 px-2 rounded">Cliente: {nombreComprador}</span>
      ) : null}
      {tipo !== "tiendas" ? (
        <span tw="bg-yellow-700 border-2 border-yellow-700 text-white py-1 px-2 rounded">
          Vendedor: {nombreVendedor}
        </span>
      ) : null}
      {tipo !== "repartidores" ? (
        <span tw="bg-green-700 border-2 border-green-700 text-white py-1 px-2 rounded">
          Repartidor: {nombreRepartidor ?? "Sin repartidor"}
        </span>
      ) : null}
    </button>
  );
};

export default CartaChatBtn;
