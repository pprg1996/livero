import { Mensaje } from "features/compradores/types";
import { mandarMensaje, useOperaciones } from "features/firebase";
import { FC, MouseEventHandler, useEffect, useRef } from "react";
import tw from "twin.macro";

const ChatDetallado: FC<{ operacionIdSeleccionada: string; tipo: "compradores" | "tiendas" | "repartidores" }> = ({
  operacionIdSeleccionada,
  tipo,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const operaciones = useOperaciones(tipo);
  const operacionSeleccionada = operaciones && operaciones[operacionIdSeleccionada];
  const mensajesRecord = operacionSeleccionada?.mensajes;
  const mensajes = mensajesRecord
    ? Object.entries(mensajesRecord)
        .map(([, mensaje]) => {
          return mensaje;
        })
        .sort((a, b) => a.timestamp - b.timestamp)
    : [];

  const enviarMensaje = () => {
    inputRef.current?.focus();

    const texto = (inputRef.current as HTMLInputElement).value;
    let rol: "comprador" | "vendedor" | "repartidor" = "comprador";
    if (tipo === "tiendas") rol = "vendedor";
    else if (tipo === "repartidores") rol = "repartidor";

    mandarMensaje({ texto, rol, timestamp: Date.now() }, operacionIdSeleccionada);

    (inputRef.current as HTMLInputElement).value = "";
  };

  return (
    <div tw="h-full grid grid-template-rows[1fr auto] grid-cols-1 space-y-2">
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

  useEffect(() => {
    listDivRef.current?.scrollTo(0, listDivRef.current.scrollHeight);
  });

  return (
    <div tw="flex flex-col space-y-2 overflow-auto px-2" ref={listDivRef}>
      {mensajes.map(mensaje => {
        let mensajeBg = tw`bg-blue-700`;
        switch (mensaje.rol) {
          case "vendedor":
            mensajeBg = tw`bg-yellow-700`;
            break;
          case "repartidor":
            mensajeBg = tw`bg-green-700`;
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
        }

        return (
          <div key={mensaje.timestamp} tw="rounded p-1" css={[mensajeBg, mensajeAlign]}>
            <span tw="text-white text-sm">{mensaje.texto}</span>
          </div>
        );
      })}
    </div>
  );
};

export default ChatDetallado;
