import MenuSvg from "../../../assets/icons/menu.svg";
import { useContext, useState } from "react";
import { useRouter } from "next/router";
import SideMenu from "features/global/components/SideMenu";
import { globalContext } from "pages/_app";
import tw from "twin.macro";
import DetallesOperacionDrawer from "features/chat/DetallesOperacionDrawer";
import CartSvg from "../../../assets/icons/shopping-cart.svg";
import CarritoDrawer from "features/compradores/CarritoDrawer";
import { useCompradores, useOperaciones, useRepartidores } from "features/firebase";
import EditSvg from "../../../assets/icons/edit.svg";
import CameraSvg from "../../../assets/icons/camera.svg";
import firebase from "firebase";
import ProfileImgModal from "./ProfileImgModal";
import { capitalizeFirstLetter } from "shared/utils";

const Header = () => {
  const [showSideMenu, setShowSideMenu] = useState(false);
  const [showProfileImgModal, setShowProfileImgModal] = useState(false);
  const router = useRouter();
  const userUID = useContext(globalContext).state.user?.uid as string;
  const compradores = useCompradores();
  const repartidores = useRepartidores();

  const operaciones = useOperaciones();
  const operacionChatId = useContext(globalContext).state.operacionChatId;
  const operacionChatSeleccionada = operacionChatId ? operaciones?.[operacionChatId] : undefined;
  const status = operacionChatSeleccionada?.status;

  let nombre = "";

  if (router.pathname === "/comprar") nombre = compradores?.[userUID]?.nombre ?? "";
  else if (router.pathname === "/repartir") nombre = repartidores?.[userUID]?.nombre ?? "";

  const cambiarNombre = () => {
    const nombreNuevo = prompt("Ingrese un nombre");

    let tipo = "";

    if (router.pathname === "/comprar") tipo = "/compradores";
    else if (router.pathname === "/repartir") tipo = "/repartidores";

    firebase.database().ref(`${tipo}/${userUID}/nombre`).set(nombreNuevo);
  };

  return (
    <div tw="flex border-b px-3 py-2 relative justify-between items-center">
      <div tw="flex items-center">
        {["/login", "/registro"].includes(router.pathname) ? null : (
          <>
            <button tw="mr-4" className="group" onClick={() => setShowSideMenu(s => !s)}>
              <MenuSvg tw="w-6 h-auto transform transition-transform group-hover:translate-x-1" />
            </button>

            <SideMenu showSideMenu={showSideMenu} setShowSideMenu={setShowSideMenu} />
          </>
        )}

        <h1 tw="font-medium text-xl text-gray-900">Livero</h1>
      </div>

      {["/comprar", "/repartir"].includes(router.pathname) ? (
        <div tw="self-end flex space-x-2 items-center">
          <button onClick={() => setShowProfileImgModal(true)}>
            <CameraSvg tw="w-4" />
          </button>

          <h1 tw="font-medium text-lg">{nombre}</h1>

          <button tw="ml-2" onClick={cambiarNombre}>
            <EditSvg tw="w-4" />
          </button>

          {showProfileImgModal ? (
            <ProfileImgModal pathname={router.pathname} setShowProfileImgModal={setShowProfileImgModal} />
          ) : null}
        </div>
      ) : null}

      {["/chatcomprador", "/chatvendedor", "/chatrepartidor"].includes(router.pathname) ? (
        <div tw="flex items-center space-x-2">
          {status ? (
            <span tw="rounded p-1.5 border-2 border-gray-700 text-gray-700 font-medium text-xs">
              Status: {capitalizeFirstLetter(status)}
            </span>
          ) : null}
          <DetallesOperacionBtn />
        </div>
      ) : null}

      {["/comprar", "/tiendas/[vendedorId]", "/tiendas/[vendedorId]/[tipoArticulo]"].includes(router.pathname) ? (
        <CarritoBtn />
      ) : null}
    </div>
  );
};

const CarritoBtn = () => {
  const [showCarrito, setShowCarrito] = useState(false);

  return (
    <>
      <button>
        <button tw="ml-auto" onClick={() => setShowCarrito(s => !s)}>
          <CartSvg tw="text-gray-700 transform -scale-x-1" fill="currentColor" />
        </button>
      </button>

      {showCarrito ? <CarritoDrawer setShowCarrito={setShowCarrito} /> : null}
    </>
  );
};

const DetallesOperacionBtn = () => {
  const operacionChatId = useContext(globalContext).state.operacionChatId;
  const [showDetalles, setShowDetalles] = useState(false);

  return (
    <>
      <button
        onClick={() => setShowDetalles(true)}
        tw="border rounded p-1.5"
        css={[!operacionChatId ? tw`hidden` : null]}
      >
        Detalles
      </button>

      {showDetalles ? <DetallesOperacionDrawer setShowDetalles={setShowDetalles} /> : null}
    </>
  );
};

export default Header;
