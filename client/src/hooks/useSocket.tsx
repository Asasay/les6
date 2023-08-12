import { Dispatch, useEffect, useState } from "react";
import { Message, socket } from "../App";

const useSocket = (
  setMessages: Dispatch<React.SetStateAction<Message[]>>,
  setAvailableTags: Dispatch<React.SetStateAction<Message["tags"]>>
) => {
  const [isConnected, setIsConnected] = useState(socket.connected);

  useEffect(() => {
    socket.on("connect", () => {
      setIsConnected(true);
      socket.emit("initialize");
    });
    socket.on("disconnect", () => setIsConnected(false));
    socket.on("initialize", (args: Message[]) => setMessages(args));
    socket.on("chat message", (msg: Message) =>
      setMessages((previous) => [...previous, msg])
    );
    socket.on("get tags", (args: Message["tags"]) => setAvailableTags(args));
    return () => {
      socket.off();
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
