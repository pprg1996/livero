import "features/firebase";
import { AppProps } from "next/dist/next-server/lib/router/router";
import Head from "next/head";
import { GlobalStyles } from "twin.macro";
import styled, { createGlobalStyle } from "styled-components";
import { createContext, useEffect, useReducer } from "react";
import { useRouter } from "next/router";
import firebase from "firebase/app";
import Header from "features/global/components/Header";
import BottomTabs from "features/global/components/BottomTabs";

const CustomGlobalStyles = createGlobalStyle`
html,
body {
  height:100%;
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

const AppDiv = styled.div`
  height: 100%;
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: auto 1fr auto;
  max-width: 640px;
  margin: 0 auto;
`;

function MyApp({ Component, pageProps }: AppProps) {
  const [state, dispatch] = useReducer(reducer, { user: undefined });
  const router = useRouter();

  useEffect(() => {
    firebase.auth().onAuthStateChanged(user => {
      dispatch({ type: Actions.SET_USER, payload: user });
      if (!user) router.push("/login");
    });

    const mainDiv = document.getElementById("__next")?.style;
    if (mainDiv) mainDiv.height = "100%";
  }, []);

  return (
    <globalContext.Provider value={state}>
      <Head>
        <title>Livero</title>
      </Head>
      <CustomGlobalStyles />
      <GlobalStyles />

      <AppDiv>
        <Header />

        <div id="content-container" tw="relative h-full overflow-auto">
          {state.user !== undefined ? <Component {...pageProps} /> : null}
        </div>

        <BottomTabs />
      </AppDiv>
    </globalContext.Provider>
  );
}

export default MyApp;
