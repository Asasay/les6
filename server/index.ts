import express from "express";
import Message, { Tag } from "./db";
import http from "http";
import { Server } from "socket.io";
import "dotenv/config";
import logger from "./logger";

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const port = process.env.SERVER_PORT;

app.use(express.static(__dirname + "/public"));
app.get("/", (req, res) => {
  res.sendFile("index.html");
});

io.on("connection", (socket) => {
  logger.info("User connected: " + socket.id);

  socket.onAny((event, ...args) => {
    logger.info(
      `Got "${event}" event ${
        args.length > 0 ? ": " + args : "without any arguments"
      }`
    );
  });

  socket.on("initialize", () => {
    // @ts-ignore
    Message.getMessageHistory().then((history) =>
      socket.emit("initialize", history)
    );
    emitTags();
  });

  const emitTags = async () => {
    const allTags = await Tag.findAll({ attributes: ["name"], raw: true });
    socket.emit(
      "get tags",
      allTags.map((tag) => tag.name)
    );
  };

  socket.on("get tags", emitTags);

  socket.on("chat message", ({ tags, text }) => {
    // @ts-ignore
    Message.createNewMessage({ tags, text });
    io.emit("chat message", { tags, text });
  });

  socket.on("disconnect", async () => {
    logger.info("user disconnected: " + socket.id);
    const sockets = await io.fetchSockets();
    logger.info("Connected users: " + sockets.map((conn) => conn.id));
  });
});

server.listen(port, () => {
  logger.info(`⚡️[server]: Server is running at port: ${port}`);
});
