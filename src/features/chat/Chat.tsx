import { FC, useContext, useEffect, useState } from "react";
import { useOperacionesPersonales } from "features/firebase";
import CartaChatBtn from "features/chat/CartaChatBtn";
import ChatDetallado from "./ChatDetallado";
import { globalContext } from "pages/_app";

const Chat: FC<{ tipo: "compradores" | "tiendas" | "repartidores" }> = ({ tipo }) => {
  const operaciones = useOperacionesPersonales(tipo);
  const [operacionIdSeleccionada, setOperacionIdSeleccionada] = useState<string>();
  const userUID = useContext(globalContext).user?.uid;

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
