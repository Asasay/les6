import { Dispatch, useEffect, useState } from "react";
import { Message, socket } from "../App";

const useSocket = (setMessages: Dispatch<React.SetStateAction<Message[]>>) => {
  const [isConnected, setIsConnected] = useState(socket.connected);

  useEffect(() => {
    function onConnect() {
      setIsConnected(true);
    }
    function onDisconnect() {
      setIsConnected(false);
    }
    function onChatMessage(msg: Message) {
      setMessages((previous) => [...previous, msg]);
    }
    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("chat message", onChatMessage);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("chat message", onChatMessage);
    };
  }, []);

  useEffect(() => {
    socket.connect();

    return () => {
      socket.disconnect();
    };
  }, []);

  return isConnected;
};

export default useSocket;
