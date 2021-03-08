import MenuSvg from "../../../assets/icons/menu.svg";
import { useState } from "react";
import { useRouter } from "next/router";
import SideMenu from "features/global/components/SideMenu";

const Header = () => {
  const [showSideMenu, setShowSideMenu] = useState(false);
  const router = useRouter();

  return (
    <div tw="flex border-b px-3 py-2 relative">
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
  );
};

export default Header;
