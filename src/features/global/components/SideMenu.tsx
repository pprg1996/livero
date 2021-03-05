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

  return (
    <div ref={menuRef} tw="absolute bg-white top-12 hidden border flex-col p-4 z-10" css={[showSideMenu && tw`flex`]}>
      <Link href="/comprar">
        <a>Comprar</a>
      </Link>
      <Link href="/vender">
        <a>Vender</a>
      </Link>
      <Link href="/repartir">
        <a>Repartir</a>
      </Link>
      <button onClick={() => firebase.auth().signOut()}>Cerrar sesion</button>
    </div>
  );
};

export default SideMenu;
