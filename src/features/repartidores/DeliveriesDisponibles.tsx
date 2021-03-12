import { useCompradores, useOperaciones, useOperacionesPersonales, useVendedores } from "features/firebase";
import { FC, MouseEventHandler, useContext, useState } from "react";
import tw from "twin.macro";
import firebase from "firebase/app";
import { globalContext } from "pages/_app";

const DeliveriesDisponibles: FC<{ setSelectedOperacionId: Function; selectedOperacionId: string | undefined }> = ({
  setSelectedOperacionId,
  selectedOperacionId,
}) => {
  const allOperaciones = useOperaciones();
  const compradores = useCompradores();
  const vendedores = useVendedores();

  const deliveriesDisponiblesRecord =
    allOperaciones &&
    Object.entries(allOperaciones)
      .sort((a, b) => b[1].timestamp - a[1].timestamp)
      .filter(opTuple => !opTuple[1].repartidorId);

  const seleccionarOperacion: MouseEventHandler<HTMLButtonElement> = e => {
    const operacionId = e.currentTarget.getAttribute("data-id");
    setSelectedOperacionId(operacionId);
  };

  return (
    <div tw="flex overflow-auto space-x-2 p-2">
      {deliveriesDisponiblesRecord?.map(([id, op]) => {
        if (!compradores || !vendedores) return;

        const nombreComprador = compradores[op.compradorId].nombre;
        const nombreVendedor = vendedores[op.tiendaId].titulo;

        return (
          <DeliveryCarta
            key={id}
            id={id}
            selectedOperacionId={selectedOperacionId}
            distanciaKm={2.4}
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

  const aceptarDelivery: MouseEventHandler<HTMLButtonElement> = e => {
    const operacionId = e.currentTarget.getAttribute("data-id");

    firebase.database().ref(`/operaciones/${operacionId}/repartidorId`).set(userUID);
    firebase.database().ref(`/repartidores/${userUID}/operaciones`).push(operacionId);
  };

  return (
    <div tw="p-4 shadow space-y-2 flex-shrink-0 rounded" css={[selectedOperacionId === id ? tw`bg-yellow-200` : null]}>
      <div tw="flex flex-col">
        <span>Distancia: {distanciaKm}KM</span>
        <span>Comisión: ${Math.max(1, Number((distanciaKm / 5).toFixed(1)))}</span>
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
