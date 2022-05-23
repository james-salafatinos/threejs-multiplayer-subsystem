const MultiplayerSubsystemServer =
  require("./src/utils/MultiplayerSubsystemServer").MultiplayerSubsystemServer;
require("dotenv").config();
console.log(process.env.ENVIRONMENT); // remove this after you've confirmed it working
const express = require("express");
const port = 8080;
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

let MultiplayerSubsystemServerHandler = new MultiplayerSubsystemServer(server);
MultiplayerSubsystemServerHandler.listen();
