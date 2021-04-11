import { mandarMensaje, useOperaciones } from "features/firebase";
import { useRouter } from "next/router";
import { globalContext } from "pages/_app";
import { FC, useContext, useEffect, useState } from "react";
import { capitalizeFirstLetter } from "shared/utils";
import firebase from "firebase/app";
import { Operacion } from "features/compradores/types";
import { Calificacion } from "features/tienda/types";

const StatusOperacion = () => {
  const operacionChatId = useContext(globalContext).state.operacionChatId as string;
  const operaciones = useOperaciones();
  const operacionChatSeleccionada = operaciones?.[operacionChatId];
  const status = operacionChatSeleccionada?.status;
  const router = useRouter();
  const vendedorId = operacionChatSeleccionada?.tiendaId;
  const repartidorId = operacionChatSeleccionada?.repartidorId;
  const carrito = operacionChatSeleccionada?.carrito;

  const marcarComoPagado = () => {
    const nuevoStatus: Operacion["status"] = "repartiendo";

    setTimeout(() => {
      firebase.database().ref(`operaciones/${operacionChatId}/status`).set(nuevoStatus);
    }, 500);

    mandarMensaje(
      { texto: "Compra pagada. En espera de repartidor...", rol: "info", timestamp: Date.now() },
      operacionChatId,
    );
  };

  const marcarComoEntregado = () => {
    const nuevoStatus: Operacion["status"] = "finalizado";

    setTimeout(() => {
      firebase.database().ref(`operaciones/${operacionChatId}/status`).set(nuevoStatus);
    }, 500);

    mandarMensaje(
      { texto: "Compra recibida. Operación finalizada", rol: "info", timestamp: Date.now() },
      operacionChatId,
    );
  };

  const cancelarOperacion = () => {
    if (!confirm("¿Seguro que desea cancelar la operación?")) return;

    const nuevoStatus: Operacion["status"] = "cancelado";

    setTimeout(() => {
      firebase.database().ref(`operaciones/${operacionChatId}/status`).set(nuevoStatus);
    }, 500);

    mandarMensaje({ texto: "Operación cancelada", rol: "info", timestamp: Date.now() }, operacionChatId);
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

      {(router.pathname === "/chatcomprador" || router.pathname === "/chatvendedor") &&
      status !== "cancelado" &&
      status !== "finalizado" ? (
        <button onClick={cancelarOperacion} tw="bg-red-700 p-1.5 rounded text-white">
          Cancelar operación
        </button>
      ) : null}

      {status === "finalizado" && router.pathname === "/chatcomprador" ? (
        <>
          <h1 tw="font-medium">¿Que tal fué tu experiencia?</h1>

          <div tw="space-y-6">
            <Reviewer tipo="tiendas" userOArticuloId={vendedorId as string} />
            <Reviewer tipo="repartidores" userOArticuloId={repartidorId as string} />

            {carrito?.articuloPacks.map(({ articuloId, articulo }) => (
              <Reviewer
                key={articuloId}
                tipo="articulos"
                userOArticuloId={articuloId}
                articuloNombre={articulo.titulo}
                vendedorId={vendedorId as string}
              />
            ))}
          </div>
        </>
      ) : null}
    </div>
  );
};

const Reviewer: FC<{
  tipo: "tiendas" | "repartidores" | "articulos";
  userOArticuloId: string;
  articuloNombre?: string;
  vendedorId?: string;
}> = ({ tipo, userOArticuloId, articuloNombre, vendedorId }) => {
  const [estrellas, setEstrellas] = useState(5);
  const [critica, setCritica] = useState("");
  const [calificacionEnviada, setCalificacionEnviada] = useState(false);
  const operacionChatId = useContext(globalContext).state.operacionChatId;

  useEffect(() => {
    const calificacionRefCallback = (data: firebase.database.DataSnapshot): void => {
      setCalificacionEnviada(data.val());
    };

    if (["tiendas", "repartidores"].includes(tipo)) {
      const calificacionUsuario = tipo === "tiendas" ? "vendedor" : "repartidor";
      const calificacionRef = firebase
        .database()
        .ref(`/operaciones/${operacionChatId}/calificacionesEnviadas/${calificacionUsuario}`);

      calificacionRef.on("value", calificacionRefCallback);

      return () => calificacionRef.off("value", calificacionRefCallback);
    } else {
      const calificacionRef = firebase
        .database()
        .ref(`/operaciones/${operacionChatId}/calificacionesEnviadas/articulos/${userOArticuloId}`);

      calificacionRef.on("value", calificacionRefCallback);

      return () => calificacionRef.off("value", calificacionRefCallback);
    }
  }, []);

  const enviarCalificacion = () => {
    setTimeout(() => {
      const calificacion: Calificacion = { timestamp: Date.now(), estrellas, critica: critica || null };

      if (["tiendas", "repartidores"].includes(tipo)) {
        firebase.database().ref(`/${tipo}/${userOArticuloId}/calificaciones`).push(calificacion);

        const calificacionUsuario = tipo === "tiendas" ? "vendedor" : "repartidor";
        firebase
          .database()
          .ref(`/operaciones/${operacionChatId}/calificacionesEnviadas/${calificacionUsuario}`)
          .set(true);
      } else {
        firebase
          .database()
          .ref(`/tiendas/${vendedorId}/menu/articulos/${userOArticuloId}/calificaciones`)
          .push(calificacion);

        firebase
          .database()
          .ref(`/operaciones/${operacionChatId}/calificacionesEnviadas/articulos/${userOArticuloId}`)
          .set(true);
      }

      setCalificacionEnviada(true);
    }, 100);
  };

  if (calificacionEnviada)
    return (
      <h1 tw="text-lg font-medium text-gray-700 bg-green-300 rounded p-2 animate-bounce animation-iteration-count[1.5]">
        ¡Gracias por calificar!
      </h1>
    );

  return (
    <div tw="max-w-xs">
      <div tw="flex items-center space-x-4 mb-2">
        <h2>{tipo === "tiendas" ? "Vendedor" : tipo === "repartidores" ? "Repartidor" : articuloNombre}</h2>
        <select value={estrellas} onChange={e => setEstrellas(Number(e.target.value))}>
          <option value="5">5⭐</option>
          <option value="4">4⭐</option>
          <option value="3">3⭐</option>
          <option value="2">2⭐</option>
          <option value="1">1⭐</option>
        </select>
      </div>

      <input
        type="text"
        tw="w-full rounded-t border p-1"
        placeholder="Reseña (opcional)"
        value={critica}
        onChange={e => setCritica(e.target.value)}
      />
      <button onClick={enviarCalificacion} tw="bg-blue-700 rounded-b p-1 w-full text-white">
        Enviar calificación
      </button>
    </div>
  );
};

export default StatusOperacion;
