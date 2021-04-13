const http = require('http');
const app = require("./app");

//Listening for the cloud client requests
const server = http.createServer(app);
const port = process.env.PORT || 3001;

server.listen(port);