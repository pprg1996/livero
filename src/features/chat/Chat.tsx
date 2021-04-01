import { FC, useContext, useEffect, useState } from "react";
import { useOperacionesPersonales } from "features/firebase";
import CartaChatBtn from "features/chat/CartaChatBtn";
import ChatDetallado from "./ChatDetallado";
import { globalContext } from "pages/_app";
import { Comprador } from "features/compradores/types";
import firebase from "firebase/app";
import { Tienda } from "features/tienda/types";

const Chat: FC<{ tipo: "compradores" | "tiendas" | "repartidores" }> = ({ tipo }) => {
  const operaciones = useOperacionesPersonales(tipo);
  const operacionChatId = useContext(globalContext).state.operacionChatId;
  const userUID = useContext(globalContext).state.user?.uid;
  const [notificacionesList, setNotificacionesList] = useState<Comprador["notificacionesEnOperaciones"]>();
  const [pagosNuevosList, setPagosNuevosList] = useState<Tienda["pagosNuevosEnOperaciones"]>();

  useEffect(() => {
    const notificacionesRefFetchCallback = (data: firebase.database.DataSnapshot): void => {
      if (!data.exists) setNotificacionesList(undefined);
      else setNotificacionesList(data.val());
    };
    const pagosNuevosRefFetchCallback = (data: firebase.database.DataSnapshot): void => {
      if (!data.exists) setPagosNuevosList(undefined);
      else setPagosNuevosList(data.val());
    };

    const notificacionesRef = firebase.database().ref(`/${tipo}/${userUID}/notificacionesEnOperaciones`);
    const pagosNuevosRef = firebase.database().ref(`/${tipo}/${userUID}/pagosNuevosEnOperaciones`);

    notificacionesRef.on("value", notificacionesRefFetchCallback);
    pagosNuevosRef.on("value", pagosNuevosRefFetchCallback);

    return () => {
      notificacionesRef.off("value", notificacionesRefFetchCallback);
      pagosNuevosRef.off("value", pagosNuevosRefFetchCallback);
    };
  }, []);

  return (
    <div tw="p-2 pb-2 h-full">
      {operacionChatId ? (
        <ChatDetallado operacionIdSeleccionada={operacionChatId} tipo={tipo} />
      ) : (
        <div tw="space-y-4 flex flex-col">
          {operaciones !== undefined
            ? Object.entries(operaciones)
                .sort((a, b) => b[1].timestamp - a[1].timestamp)
                .map(([id, operacion]) => {
                  const hayNotificacion = !!notificacionesList?.[id];
                  const hayPagoNuevo = !!pagosNuevosList?.[id];

                  return (
                    <CartaChatBtn
                      key={id}
                      id={id}
                      tipo={tipo}
                      operacion={operacion}
                      hayNotificacion={hayNotificacion}
                      hayPagoNuevo={hayPagoNuevo}
                    />
                  );
                })
            : null}
        </div>
      )}
    </div>
  );
};

export default Chat;
