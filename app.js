require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const path = require("path");

const app = express();

// Middleware for parsing JSON and URL-encoded data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, "public")));

// Routes
const route = require("./routes/route"); // Routes are defined in './routes/route'
app.use("/", route); // Mounting routes defined in './routes/route' to the root path '/'

// Define route to create a new user
app.post("/createUser", async (req, res) => {
  try {
    const newUser = await user.create(req.body);
    res.status(201).send(newUser);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Define route to fetch all users
app.get("/getAllUsers", async (req, res) => {
  try {
    const allUsers = await user.find({}); //'user' model is imported correctly
    res.json(allUsers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
// Defining the mongoose connection

mongoose
  .connect(process.env.MongoDB_URL, {})
  .then(() => {
    console.log("MongoDB connected");
  })
  .catch((err) => {
    console.log(err);
  });

app.listen(3000, (err, data) => {
  console.log("started");
});
