import express from "express";
import Message from "./db";
import http from "http";
import { Server } from "socket.io";
import "dotenv/config";

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const port = process.env.SERVER_PORT;

app.use(express.static(__dirname + "/public"));
app.get("/", (req, res) => {
  res.sendFile("/public/index.html");
});
app.get("/api/messages", (req, res) => {
  Message.findAll().then((messages) => res.json(messages));
});

io.on("connection", (socket) => {
  console.log("User connected: " + socket.id);

  socket.onAny((event, ...args) => {
    console.log(`Got event ${event}: ${args}`);
  });

  socket.on("chat message", ({ tags, text }) => {
    Message.create({ tags, text });
    io.emit("chat message", { tags, text });
  });

  socket.on("disconnect", async () => {
    console.log("user disconnected: " + socket.id);
    const sockets = await io.fetchSockets();
    console.log("Connected users: " + sockets.map((conn) => conn.id));
  });
});

server.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
