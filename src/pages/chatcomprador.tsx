import Chat from "features/chat/Chat";
import { mandarMensaje } from "features/firebase";

if (typeof window !== "undefined")
  window.mandarMensaje = () =>
    mandarMensaje({ texto: "Holaaaaa", rol: "comprador", timestamp: Date.now() }, "-MV-8wvIYZJrj8bNLZLI");

const ChatComprador = () => {
  return <Chat tipo="compradores" />;
};

export default ChatComprador;
