const http = require('http');
const dataManager = require("./dataManager");

//Listening for the cloud client requests
const server = http.createServer(dataManager);
const port = process.env.PORT || 3001;

server.listen(port);