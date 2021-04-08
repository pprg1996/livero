import { FC, useContext, useEffect, useRef, useState } from "react";
import { Carrito, Operacion } from "./types";
import ReactDOM from "react-dom";
import { Actions, globalContext } from "pages/_app";
import firebase from "firebase/app";
import { useClickOutside } from "shared/hooks";
import tw from "twin.macro";
import { useCompradores, useVendedores } from "features/firebase";
import { useRouter } from "next/router";
import CarritoList from "./CarritoList";

const CarritoDrawer: FC<{ setShowCarrito: Function }> = ({ setShowCarrito }) => {
  const dispatch = useContext(globalContext).dispatch;
  const router = useRouter();
  const usarTodosLosCarritos = !router.query.vendedorId;
  const [carritoVendedorIdSeleccionado, setCarritoVendedorIdSeleccionado] = useState(
    router.query.vendedorId as string | undefined,
  );
  const userUID = useContext(globalContext).state.user?.uid as string;
  const [startAnimation, setStartAnimation] = useState(false);
  const carritoDivRef = useRef<HTMLDivElement>(null);

  const compradores = useCompradores();
  const carritos: Record<string, Carrito> | undefined = compradores?.[userUID]?.carritos;

  const vendedores = useVendedores();
  const carritosVendedoresId = Object.entries(carritos ?? {}).map(([id]) => id);
  const nombresVendedores: string[] = [];

  for (const carritoVendedorId of carritosVendedoresId) {
    nombresVendedores.push(vendedores?.[carritoVendedorId]?.titulo ?? "");
  }

  useClickOutside(carritoDivRef, () => setShowCarrito(false));

  useEffect(() => setStartAnimation(true), []);

  const procederAPagar = () => {
    if (!userUID || !carritos) return;

    const newOperacion: Operacion = {
      carrito: carritos[carritoVendedorIdSeleccionado ?? carritosVendedoresId[0]],
      compradorId: userUID,
      tiendaId: carritoVendedorIdSeleccionado ?? carritosVendedoresId[0],
      status: "pagando",
      timestamp: Date.now(),
      pagos: { repartidor: { paypal: "", zelle: "", pm: "" }, vendedor: { paypal: "", zelle: "", pm: "" } },
      calificacionesEnviadas: { vendedor: false, repartidor: false },
      repartidorConfirmado: false,
    };

    const operacionId = firebase.database().ref(`/operaciones`).push(newOperacion).key;

    const sendInfoToFirebase = async () => {
      await firebase
        .database()
        .ref(`tiendas/${carritoVendedorIdSeleccionado ?? carritosVendedoresId[0]}/operaciones`)
        .push(operacionId);

      await firebase.database().ref(`compradores/${userUID}/operaciones`).push(operacionId);

      await firebase
        .database()
        .ref(`compradores/${userUID}/carritos/${carritoVendedorIdSeleccionado ?? carritosVendedoresId[0]}`)
        .remove();

      dispatch({ type: Actions.SET_OPERACION_CHAT_ID, payload: operacionId });
      router.push("/chatcomprador");
    };

    sendInfoToFirebase();
  };

  if (typeof window === "undefined") {
    return null;
  }

  return ReactDOM.createPortal(
    <div tw="bg-gray-700 bg-opacity-40 w-full h-full absolute z-10 flex justify-end right-0 top-0">
      <div
        ref={carritoDivRef}
        tw="relative -right-96 bg-white transition-all p-2 overflow-auto"
        css={[startAnimation ? tw`right-0` : null]}
      >
        {usarTodosLosCarritos && carritosVendedoresId.length > 0 ? (
          <div tw="flex space-x-2 mb-2">
            <h1>Tienda:</h1>

            <select
              value={carritoVendedorIdSeleccionado}
              onChange={e => setCarritoVendedorIdSeleccionado(e.currentTarget.value)}
            >
              {nombresVendedores.map((nombre, i) => (
                <option key={carritosVendedoresId[i]} value={carritosVendedoresId[i]}>
                  {nombre}
                </option>
              ))}
            </select>
          </div>
        ) : null}

        {carritosVendedoresId.length > 0 && carritos ? (
          <>
            <CarritoList
              vendedorId={carritoVendedorIdSeleccionado ?? carritosVendedoresId[0]}
              carrito={carritos[carritoVendedorIdSeleccionado ?? carritosVendedoresId[0]]}
            />
            <button tw="rounded bg-blue-700 text-white p-1 w-full" onClick={procederAPagar}>
              Proceder a pagar
            </button>
          </>
        ) : (
          <h1 tw="font-medium text-gray-700">Tu carrito esta vacio</h1>
        )}
      </div>
    </div>,
    document.getElementById("content-container") as HTMLElement,
  );
};

export default CarritoDrawer;
