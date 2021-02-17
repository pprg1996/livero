import "features/firebase";
import { AppProps } from "next/dist/next-server/lib/router/router";
import Head from "next/head";
import tw, { GlobalStyles } from "twin.macro";
import { createGlobalStyle } from "styled-components";
import MenuSvg from "../assets/icons/menu.svg";
import Link from "next/link";
import { createContext, FC, useEffect, useReducer, useState } from "react";
import { useRouter } from "next/router";
import firebase from "firebase/app";

const CustomGlobalStyles = createGlobalStyle`
html,
body {
  padding: 0;
  margin: 0;
}

a {
  color: inherit;
  text-decoration: none;
  cursor: pointer;
}

button {
  cursor: pointer;
}

* {
  box-sizing: border-box;
}
`;

interface GlobalState {
  user: firebase.User | null | undefined;
}

export enum Actions {
  SET_USER = "setUser",
}

export const globalContext = createContext<GlobalState>({ user: undefined });

const reducer = (state: GlobalState, action: { type: string; payload: any }): GlobalState => {
  switch (action.type) {
    case Actions.SET_USER:
      return { ...state, user: action.payload };
    default:
      return state;
  }
};

function MyApp({ Component, pageProps }: AppProps) {
  const [state, dispatch] = useReducer(reducer, { user: undefined });
  const router = useRouter();

  useEffect(() => {
    firebase.auth().onAuthStateChanged(user => {
      dispatch({ type: Actions.SET_USER, payload: user });
      if (!user) router.push("/login");
    });
  }, []);

  return (
    <globalContext.Provider value={state}>
      <Head>
        <title>Livero</title>
      </Head>
      <CustomGlobalStyles />
      <GlobalStyles />
      <Header />
      <div tw="max-w-screen-sm m-auto">
        <Component {...pageProps} />
      </div>
    </globalContext.Provider>
  );
}

const Header = () => {
  const [showSideMenu, setShowSideMenu] = useState(false);
  const router = useRouter();

  return (
    <div tw="flex border-b px-3 py-1 relative max-w-screen-sm mx-auto">
      {["/login", "/registro"].includes(router.pathname) ? null : (
        <>
          <button tw="mr-4" className="group" onClick={() => setShowSideMenu(s => !s)}>
            <MenuSvg tw="w-6 h-auto transform transition-transform group-hover:translate-x-1" />
          </button>

          <SideMenu showSideMenu={showSideMenu} />
        </>
      )}

      <h1 tw="font-medium text-xl text-gray-900">Livero</h1>
    </div>
  );
};

const SideMenu: FC<{ showSideMenu: boolean }> = ({ showSideMenu }) => {
  return (
    <div tw="absolute bg-white top-12 hidden border flex-col p-4 z-10" css={[showSideMenu && tw`flex`]}>
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

export default MyApp;
