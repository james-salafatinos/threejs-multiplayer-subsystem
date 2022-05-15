const express = require("express");
const port = 3000;
const app = express();
const path = require("path");
const httpServer = require("http").createServer();

app.get("/", function (request, response) {
  app.use("/public", express.static("./src/public"));
  app.use("/static", express.static("./src/static"));
  app.use("/modules", express.static("./src/modules"));
  app.use("/utils", express.static("./src/utils"));
  app.use("/data", express.static("./src/data"));
  response.sendFile(__dirname + "/src/views/index.html");
});

var server = app.listen(process.env.PORT || port, listen);
function listen() {
  var host = server.address().address;
  var port = server.address().port;
  console.log("App listening at http://" + host + ":" + port);
  console.log("App listening at http://localhost:" + port);
}

const io = require("socket.io")(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    transports: ["websocket", "polling"],
    credentials: true,
  },
  allowEIO3: true,
});

io.sockets.on("connection", function (socket) {
  console.log("We have a new client: " + socket.id);

  socket.on("mouse", function (data) {
    console.log("Received: 'mouse' " + data.x + " " + data.y);
    socket.broadcast.emit("mouse", data);
  });

  socket.on("msg", function (msg) {
    socket.broadcast.emit("msg", msg);
  });
  socket.on("disconnect", function () {
    console.log("Client has disconnected");
  });
});
