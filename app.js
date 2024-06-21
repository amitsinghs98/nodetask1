require("dotenv").config();
const express = require("express");
const http = require("http");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const path = require("path");
const User = require("./model/model");
const socket = require("./socket");

const app = express();
const server = http.createServer(app);
const io = socket.init(server); // Initialize Socket.IO

// Middleware for parsing JSON and URL-encoded data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, "public")));

// Routes
const route = require("./routes/route"); // Routes are defined in './routes/route'
app.use("/", route); // Mounting routes defined in './routes/route' to the root path '/'

// Defining the mongoose connection
mongoose
  .connect(process.env.MongoDB_URL, {})
  .then(() => {
    console.log("MongoDB connected");
  })
  .catch((err) => {
    console.log(err);
  });

// Server listening
server.listen(4000, (err, data) => {
  console.log("Server started on port 4000");
});

const socketModule = require("./socket");
async function clearAllSocketData() {
  try {
    await socketModule.clearAllData();
    console.log("All data cleared and all clients disconnected.");
  } catch (err) {
    console.error("Error clearing data:", err.message);
  }
}

// clearAllSocketData();
