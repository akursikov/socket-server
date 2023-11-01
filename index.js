var WebSocketServer = require("websocket").server;
var http = require("http");

var server = http.createServer(function (request, response) {
  console.log(new Date() + " Received request for " + request.url);
  response.writeHead(404);
  response.end();
});

const port = process.env.PORT || 8080;

server.listen(port, function () {
  console.log(new Date() + " Server is listening on port " + port);
});

wsServer = new WebSocketServer({
  httpServer: server,
  autoAcceptConnections: false,
});

wsServer.on("request", function (request) {
  var connection = request.accept("echo-protocol", request.origin);
  console.log(new Date() + " Connection accepted.");
  connection.on("message", function (message) {
    connection.send(message.utf8Data);
  });
  setInterval(() => {
    connection.send(
      JSON.stringify({ user: "server", message: "server message" })
    );
  }, 3000);
  connection.on("close", function (reasonCode, description) {
    console.log(
      new Date() + " Peer " + connection.remoteAddress + " disconnected."
    );
  });
});
