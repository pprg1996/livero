import { FC, useState } from "react";
import { useOperaciones } from "features/firebase";
import CartaChatBtn from "features/chat/CartaChatBtn";
import ChatDetallado from "./ChatDetallado";

const Chat: FC<{ tipo: "compradores" | "tiendas" | "repartidores" }> = ({ tipo }) => {
  const operaciones = useOperaciones(tipo);
  const [operacionIdSeleccionada, setOperacionIdSeleccionada] = useState<string>();

  return (
    <div tw="p-2 pb-2 h-full">
      {operacionIdSeleccionada ? (
        <ChatDetallado operacionIdSeleccionada={operacionIdSeleccionada} tipo={tipo} />
      ) : (
        <div tw="space-y-4 flex flex-col">
          {operaciones !== undefined
            ? Object.entries(operaciones).map(([id, operacion]) => (
                <CartaChatBtn
                  key={id}
                  id={id}
                  tipo={tipo}
                  setOperacionIdSeleccionada={setOperacionIdSeleccionada}
                  operacion={operacion}
                />
              ))
            : null}
        </div>
      )}
    </div>
  );
};

export default Chat;
