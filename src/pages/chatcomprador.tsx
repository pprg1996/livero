import Chat from "features/chat/Chat";
import { useUpdateUbicacion } from "features/firebase";

const ChatComprador = () => {
  useUpdateUbicacion("compradores");

  return <Chat tipo="compradores" />;
};

export default ChatComprador;
