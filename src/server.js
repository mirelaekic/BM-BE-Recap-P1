const express = require("express");
const cors = require("cors");
const listEndpoints = require("express-list-endpoints");
const exam = require("./services/exam");
const {
  badRequestHandler,
  notFoundHandler,
  genericErrorHandler,
} = require("./errorHandlers");

const server = express();

const port = process.env.PORT || 3002

server.use(cors())
server.use(express.json())
server.use("/exam", exam)

server.use(badRequestHandler)
server.use(notFoundHandler)
server.use(genericErrorHandler)

console.log(listEndpoints(server))

server.listen(port, () => {
  console.log(`Server listening on port ${port}`)
});