const express = require("express");
const cors = require("cors");
const app = express();
app.use(express.json());
app.use(cors());

const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
  maxHttpBufferSize: 1e8,
});

const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });

const port = process.env.PORT;

io.on("connection", (socket) => {
  socket.on("login", async (data) => {
    console.log(data);
    try {
      socket.join(data._id);
    } catch (error) {
      io.to(socket.id).emit("error", error);
    }
  });
  socket.on("sendMessage", async (data) => {
    console.log(data)
    try {
      io.to(data.from).emit("receiveMessage", { data });
    } catch (error) {
      io.to(socket.id).emit("error", error);
    }
  });
});

server.listen(port, () => console.log("server running on port:" + port));
