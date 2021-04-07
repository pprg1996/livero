import tw from "twin.macro";
import Link from "next/link";
import { FC, useRef } from "react";
import firebase from "firebase/app";
import { useClickOutside } from "shared/hooks";

const SideMenu: FC<{ showSideMenu: boolean; setShowSideMenu: Function }> = ({ showSideMenu, setShowSideMenu }) => {
  const menuRef = useRef(null);
  useClickOutside(menuRef, () => {
    if (showSideMenu) setShowSideMenu(false);
  });

  const cerrarSideMenuOnClick = () => {
    setShowSideMenu(false);
  };

  return (
    <div ref={menuRef} tw="absolute bg-white top-12 hidden border flex-col p-4 z-10" css={[showSideMenu && tw`flex`]}>
      <Link href="/comprar">
        <a onClick={cerrarSideMenuOnClick}>Comprar</a>
      </Link>
      <Link href="/vender">
        <a onClick={cerrarSideMenuOnClick}>Vender</a>
      </Link>
      <Link href="/repartir">
        <a onClick={cerrarSideMenuOnClick}>Repartir</a>
      </Link>
      <button
        onClick={() => {
          firebase.auth().signOut();
          cerrarSideMenuOnClick();
        }}
      >
        Cerrar sesión
      </button>
    </div>
  );
};

export default SideMenu;
