import { useOperaciones } from "features/firebase";
import { FC } from "react";

const ChatDetallado: FC<{ operacionIdSeleccionada: string; tipo: "compradores" | "tiendas" | "repartidores" }> = ({
  operacionIdSeleccionada,
  tipo,
}) => {
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

  return (
    <div>
      {mensajes.map(mensaje => (
        <div key={mensaje.timestamp}>{mensaje.texto}</div>
      ))}
    </div>
  );
};

export default ChatDetallado;
