import Chat from "features/chat/Chat";
import { useUpdateUbicacion } from "features/firebase";

const ChatRepartidor = () => {
  useUpdateUbicacion("repartidores");

  return <Chat tipo="repartidores" />;
};

export default ChatRepartidor;
