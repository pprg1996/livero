import { Mensaje } from "features/compradores/types";
import {
  mandarMensaje,
  setNotificacion,
  useFirebaseImg,
  useOperacionesPersonales,
  useRepartidores,
} from "features/firebase";
import { FC, useContext, useEffect, useRef } from "react";
import tw from "twin.macro";
import firebase from "firebase/app";
import { globalContext } from "pages/_app";
import CalificacionPromedio from "features/calificaciones/CalificacionPromedio";
import { useRouter } from "next/router";

const ChatDetallado: FC<{ operacionIdSeleccionada: string; tipo: "compradores" | "tiendas" | "repartidores" }> = ({
  operacionIdSeleccionada,
  tipo,
}) => {
  const { pathname, push } = useRouter();
  const userUID = useContext(globalContext).state.user?.uid;
  const inputRef = useRef<HTMLInputElement>(null);
  const operaciones = useOperacionesPersonales(tipo);
  const operacionSeleccionada = operaciones?.[operacionIdSeleccionada];

  const repartidor = useRepartidores()?.[operacionSeleccionada?.repartidorId ?? ""];
  const { imgUrl: repartidorImgUrl } = useFirebaseImg(operacionSeleccionada?.repartidorId, "profile", "repartidores");

  const mensajesRecord = operacionSeleccionada?.mensajes;
  const mensajes = mensajesRecord
    ? Object.entries(mensajesRecord)
        .map(([, mensaje]) => {
          return mensaje;
        })
        .sort((a, b) => a.timestamp - b.timestamp)
    : [];

  useEffect(() => {
    firebase.database().ref(`/${tipo}/${userUID}/notificacionesEnOperaciones/${operacionIdSeleccionada}`).remove();
  });

  useEffect(() => {
    if (pathname === "/chatrepartidor" && operacionSeleccionada && !repartidor) {
      alert("Fuiste rechazado por el comprador");
      push("/repartir");
    }
  }, [repartidor]);

  const enviarMensaje = () => {
    inputRef.current?.focus();

    const texto = (inputRef.current as HTMLInputElement).value;
    let rol: "comprador" | "vendedor" | "repartidor" = "comprador";
    if (tipo === "tiendas") rol = "vendedor";
    else if (tipo === "repartidores") rol = "repartidor";

    mandarMensaje({ texto, rol, timestamp: Date.now() }, operacionIdSeleccionada);

    const compradorId = operaciones?.[operacionIdSeleccionada].compradorId as string;
    const vendedorId = operaciones?.[operacionIdSeleccionada].tiendaId as string;
    const repartidorId = operaciones?.[operacionIdSeleccionada].repartidorId;

    setNotificacion("compradores", compradorId, operacionIdSeleccionada);
    setNotificacion("tiendas", vendedorId, operacionIdSeleccionada);

    if (repartidorId) setNotificacion("repartidores", repartidorId, operacionIdSeleccionada);

    (inputRef.current as HTMLInputElement).value = "";
  };

  const aceptarRepartidor = () => {
    firebase.database().ref(`operaciones/${operacionIdSeleccionada}/repartidorConfirmado`).set(true);

    mandarMensaje({ rol: "info", texto: "Repartidor aceptado", timestamp: Date.now() }, operacionIdSeleccionada);
  };

  const rechazarRepartidor = () => {
    firebase.database().ref(`operaciones/${operacionIdSeleccionada}/repartidorId`).remove();
    firebase
      .database()
      .ref(`repartidores/${operacionSeleccionada?.repartidorId}/operaciones`)
      .get()
      .then(data => {
        const operacionesTuple = Object.entries(data.val());

        operacionesTuple.forEach(([metaId, operacionId]) => {
          if (operacionId === operacionIdSeleccionada)
            firebase
              .database()
              .ref(`repartidores/${operacionSeleccionada?.repartidorId}/operaciones/${metaId}`)
              .remove();
        });
      });

    mandarMensaje({ rol: "info", texto: "Repartidor rechazado", timestamp: Date.now() }, operacionIdSeleccionada);
  };

  if (pathname === "/chatrepartidor" && !operacionSeleccionada?.repartidorConfirmado) {
    return <h1 tw="text-center mt-64 font-medium text-gray-700">Espera que el comprador te acepte</h1>;
  }

  return (
    <div tw="h-full grid grid-template-rows[1fr auto] grid-cols-1 space-y-2">
      {pathname === "/chatcomprador" && repartidor && !operacionSeleccionada?.repartidorConfirmado ? (
        <div tw="border-b flex justify-end px-8 py-1 space-x-3">
          <img tw="w-32 h-32 object-contain" src={repartidorImgUrl} />

          <div tw="flex flex-col self-center space-y-3">
            <span>Repartidor: {repartidor.nombre}</span>
            <CalificacionPromedio calificaciones={repartidor.calificaciones} />
            <div tw="space-x-2">
              <button onClick={aceptarRepartidor} tw="rounded p-1 text-white bg-blue-700">
                Aceptar
              </button>
              <button onClick={rechazarRepartidor} tw="rounded p-1 text-white bg-red-700">
                Rechazar
              </button>
            </div>
          </div>
        </div>
      ) : null}

      <MensajesList mensajes={mensajes} tipo={tipo} />

      <div tw="flex space-x-2">
        <input tw="border flex-grow" ref={inputRef} />
        <button tw="rounded bg-blue-700 text-xs text-white p-1" onClick={enviarMensaje}>
          Enviar
        </button>
      </div>
    </div>
  );
};

const MensajesList: FC<{ mensajes: Mensaje[]; tipo: "compradores" | "tiendas" | "repartidores" }> = ({
  tipo,
  mensajes,
}) => {
  const listDivRef = useRef<HTMLDivElement>(null);
  const scrollToBottom = () => listDivRef.current?.scrollTo(0, listDivRef.current.scrollHeight);
  const { pathname } = useRouter();

  useEffect(() => {
    scrollToBottom();
  }, [mensajes.length]);

  useEffect(() => {
    try {
      new ResizeObserver(() => scrollToBottom()).observe(listDivRef.current as HTMLDivElement);
    } catch {}
  }, []);

  return (
    <div tw="flex flex-col space-y-2 overflow-auto px-2" ref={listDivRef}>
      <div tw="flex space-x-2">
        <div tw="rounded p-1 self-center bg-yellow-700">
          <span tw="text-white text-sm">{pathname === "/chatvendedor" ? "Tu" : "Vendedor"}</span>
        </div>
        <div tw="rounded p-1 self-center bg-blue-700">
          <span tw="text-white text-sm">{pathname === "/chatcomprador" ? "Tu" : "Comprador"}</span>
        </div>
        <div tw="rounded p-1 self-center bg-green-700">
          <span tw="text-white text-sm">{pathname === "/chatrepartidor" ? "Tu" : "Repartidor"}</span>
        </div>
      </div>

      <div tw="rounded p-1 self-center bg-gray-500">
        <span tw="text-white text-sm">¡Usa el chat para comunicarte!</span>
      </div>

      {pathname === "/chatvendedor" ? (
        <>
          <div tw="rounded p-1 self-center bg-gray-500">
            <span tw="text-white text-sm">
              Ve a Detalles ➡ Pagos para chequear tus pagos recibidos, y pagar al repartidor cuando finalice la
              operación
            </span>
          </div>

          <div tw="rounded p-1 self-center bg-gray-500">
            <span tw="text-white text-sm">Ve a Detalles ➡ Status y marca como "Pagado" al recibir tu pago</span>
          </div>
        </>
      ) : null}

      {pathname === "/chatcomprador" ? (
        <>
          <div tw="rounded p-1 self-center bg-gray-500">
            <span tw="text-white text-sm">
              Ve a Detalles ➡ Pagos para pagar al vendedor. Él se encargara de pagarle al repartidor cuando se asigne
              uno
            </span>
          </div>

          <div tw="rounded p-1 self-center bg-gray-500">
            <span tw="text-white text-sm">Debes aceptar o rechazar un repartidor cuando se asigne uno</span>
          </div>

          <div tw="rounded p-1 self-center bg-gray-500">
            <span tw="text-white text-sm">Ve a Detalles ➡ Status y marca como "Entregado" al recibir tu pedido</span>
          </div>
        </>
      ) : null}

      {pathname === "/chatrepartidor" ? (
        <div tw="rounded p-1 self-center bg-gray-500">
          <span tw="text-white text-sm">Ve a Detalles ➡ Pagos para chequear tus pagos recibidos</span>
        </div>
      ) : null}

      {mensajes.map(mensaje => {
        let mensajeBg = tw`bg-blue-700`;
        switch (mensaje.rol) {
          case "vendedor":
            mensajeBg = tw`bg-yellow-700`;
            break;
          case "repartidor":
            mensajeBg = tw`bg-green-700`;
            break;
          case "info":
            mensajeBg = tw`bg-gray-500`;
            break;

          default:
            break;
        }

        let mensajeAlign = tw`self-start`;
        if (
          (tipo === "compradores" && mensaje.rol === "comprador") ||
          (tipo === "tiendas" && mensaje.rol === "vendedor") ||
          (tipo === "repartidores" && mensaje.rol === "repartidor")
        ) {
          mensajeAlign = tw`self-end`;
        } else if (mensaje.rol === "info") {
          mensajeAlign = tw`self-center`;
        }

        return (
          <div key={mensaje.timestamp} tw="rounded p-1 max-w-full" css={[mensajeBg, mensajeAlign]}>
            <span tw="text-white text-sm max-w-full break-words">{mensaje.texto}</span>
          </div>
        );
      })}
    </div>
  );
};

export default ChatDetallado;
