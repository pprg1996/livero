import MenuSvg from "../../../assets/icons/menu.svg";
import { useContext, useState } from "react";
import { useRouter } from "next/router";
import SideMenu from "features/global/components/SideMenu";
import { globalContext } from "pages/_app";
import tw from "twin.macro";
import DetallesOperacionDrawer from "features/chat/DetallesOperacionDrawer";
import CartSvg from "../../../assets/icons/shopping-cart.svg";
import CarritoDrawer from "features/compradores/CarritoDrawer";

const Header = () => {
  const [showSideMenu, setShowSideMenu] = useState(false);
  const router = useRouter();

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

      {["/chatcomprador", "/chatvendedor", "/chatrepartidor"].includes(router.pathname) ? (
        <DetallesOperacionBtn />
      ) : null}

      <CarritoBtn />
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

      {showCarrito ? <CarritoDrawer setShowCarrito={setShowCarrito} /* setCompraStatus={setCompraStatus} */ /> : null}
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
