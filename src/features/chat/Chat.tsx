import { FC, useContext } from "react";
import { useOperacionesPersonales } from "features/firebase";
import CartaChatBtn from "features/chat/CartaChatBtn";
import ChatDetallado from "./ChatDetallado";
import { globalContext } from "pages/_app";

const Chat: FC<{ tipo: "compradores" | "tiendas" | "repartidores" }> = ({ tipo }) => {
  const operaciones = useOperacionesPersonales(tipo);
  const operacionChatId = useContext(globalContext).state.operacionChatId;

  return (
    <div tw="p-2 pb-2 h-full">
      {operacionChatId ? (
        <ChatDetallado operacionIdSeleccionada={operacionChatId} tipo={tipo} />
      ) : (
        <div tw="space-y-4 flex flex-col">
          {operaciones !== undefined
            ? Object.entries(operaciones)
                .sort((a, b) => b[1].timestamp - a[1].timestamp)
                .map(([id, operacion]) => <CartaChatBtn key={id} id={id} tipo={tipo} operacion={operacion} />)
            : null}
        </div>
      )}
    </div>
  );
};

export default Chat;
