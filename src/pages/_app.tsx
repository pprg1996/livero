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
import Router from "next/router";
import NProgress from "nprogress"; //nprogress module
import "nprogress/nprogress.css"; //styles of nprogress

NProgress.configure({ showSpinner: false });

//Binding events.
Router.events.on("routeChangeStart", () => NProgress.start());
Router.events.on("routeChangeComplete", () => NProgress.done());
Router.events.on("routeChangeError", () => NProgress.done());

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
  operacionChatId: string | undefined;
  dolar: number;
}

export enum Actions {
  SET_USER = "setUser",
  SET_OPERACION_CHAT_ID = "setOperacionChatId",
  SET_DOLAR = "setDolar",
}

const defaultGlobalState: GlobalState = { user: undefined, operacionChatId: undefined, dolar: 1 };
export const globalContext = createContext<{ state: GlobalState; dispatch: Function }>({
  state: defaultGlobalState,
  dispatch: () => {},
});

const reducer = (state: GlobalState, action: { type: string; payload: any }): GlobalState => {
  switch (action.type) {
    case Actions.SET_USER:
      return { ...state, user: action.payload };
    case Actions.SET_OPERACION_CHAT_ID:
      return { ...state, operacionChatId: action.payload };
    case Actions.SET_DOLAR:
      return { ...state, dolar: action.payload };
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
  const [state, dispatch] = useReducer(reducer, defaultGlobalState);
  const router = useRouter();

  useEffect(() => {
    firebase.auth().onAuthStateChanged(user => {
      dispatch({ type: Actions.SET_USER, payload: user });
      if (!user) router.push("/login");
    });

    const mainDiv = document.getElementById("__next")?.style;
    if (mainDiv) mainDiv.height = "100%";

    fetch("https://s3.amazonaws.com/dolartoday/data.json")
      .then(result => result.json())
      .then(json => dispatch({ type: Actions.SET_DOLAR, payload: json.USD.dolartoday }));
  }, []);

  return (
    <globalContext.Provider value={{ state, dispatch }}>
      <Head>
        <title>Livero</title>
      </Head>
      <CustomGlobalStyles />
      <GlobalStyles />
      {state.user !== undefined ? (
        <AppDiv>
          <Header />

          <div id="content-container" tw="relative h-full overflow-y-auto overflow-x-hidden">
            <Component {...pageProps} />
          </div>

          {state.user !== null && router.pathname !== "/rolselect" ? <BottomTabs /> : null}
        </AppDiv>
      ) : null}
    </globalContext.Provider>
  );
}

export default MyApp;
