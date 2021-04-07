import { mandarMensaje, useCompradores, useOperaciones, useVendedores } from "features/firebase";
import { FC, MouseEventHandler, useContext } from "react";
import tw from "twin.macro";
import firebase from "firebase/app";
import { Actions, globalContext } from "pages/_app";
import { useRouter } from "next/router";
import { distanciaEntreUbicaciones } from "shared/utils";

const DeliveriesDisponibles: FC<{ setSelectedOperacionId: Function; selectedOperacionId: string | undefined }> = ({
  setSelectedOperacionId,
  selectedOperacionId,
}) => {
  const operaciones = useOperaciones();
  const compradores = useCompradores();
  const vendedores = useVendedores();

  const deliveriesDisponiblesRecord =
    operaciones &&
    Object.entries(operaciones)
      .sort((a, b) => b[1].timestamp - a[1].timestamp)
      .filter(opTuple => !opTuple[1].repartidorId && opTuple[1].status === "repartiendo");

  const seleccionarOperacion: MouseEventHandler<HTMLButtonElement> = e => {
    const operacionId = e.currentTarget.getAttribute("data-id");
    setSelectedOperacionId(operacionId);
  };

  return (
    <div tw="flex overflow-auto space-x-2 p-2">
      {deliveriesDisponiblesRecord?.map(([id, op]) => {
        if (!compradores || !vendedores) return;

        const comprador = compradores[op.compradorId];
        const nombreComprador = comprador.nombre;
        const vendedor = vendedores[op.tiendaId];
        const nombreVendedor = vendedor.titulo;
        const distanciaKm = distanciaEntreUbicaciones(comprador.ubicacion, vendedor.ubicacion);

        return (
          <DeliveryCarta
            key={id}
            id={id}
            selectedOperacionId={selectedOperacionId}
            distanciaKm={distanciaKm}
            nombreComprador={nombreComprador}
            nombreVendedor={nombreVendedor}
            seleccionarOperacion={seleccionarOperacion}
          />
        );
      })}
    </div>
  );
};

const DeliveryCarta: FC<{
  distanciaKm: number;
  nombreVendedor: string;
  nombreComprador: string;
  seleccionarOperacion: MouseEventHandler<HTMLButtonElement>;
  selectedOperacionId: string | undefined;
  id: string;
}> = ({ distanciaKm, nombreVendedor, nombreComprador, seleccionarOperacion, id, selectedOperacionId }) => {
  const userUID = useContext(globalContext).state.user?.uid;
  const dispatch = useContext(globalContext).dispatch;
  const router = useRouter();

  const aceptarDelivery: MouseEventHandler<HTMLButtonElement> = e => {
    const operacionId = e.currentTarget.getAttribute("data-id");

    const sendInfoToFirebase = async () => {
      await firebase.database().ref(`/operaciones/${operacionId}/repartidorId`).set(userUID);
      await firebase.database().ref(`/repartidores/${userUID}/operaciones`).push(operacionId);

      mandarMensaje(
        { rol: "info", texto: "Repartidor esperando confirmación", timestamp: Date.now() },
        operacionId as string,
      );

      dispatch({ type: Actions.SET_OPERACION_CHAT_ID, payload: operacionId });
      router.push("/chatrepartidor");
    };

    sendInfoToFirebase();
  };

  return (
    <div tw="p-4 shadow space-y-2 flex-shrink-0 rounded" css={[selectedOperacionId === id ? tw`bg-yellow-200` : null]}>
      <div tw="flex flex-col">
        <span>Distancia: {distanciaKm}KM</span>
        <span>Comisión: ${Math.ceil(Number((distanciaKm / 5).toFixed(2)))}</span>
        <span>Vendedor: {nombreVendedor}</span>
        <span>Comprador: {nombreComprador}</span>
      </div>

      <div tw="space-x-2">
        <button onClick={seleccionarOperacion} data-id={id} tw="bg-blue-700 text-white p-1 rounded">
          Ver en mapa
        </button>
        <button onClick={aceptarDelivery} data-id={id} tw="bg-blue-700 text-white p-1 rounded">
          Aceptar delivery
        </button>
      </div>
    </div>
  );
};

export default DeliveriesDisponibles;
