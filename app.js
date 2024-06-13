require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const path = require("path");
console.log("env", process.env.MongoDB_URL);
const app = express(); // defining the instance of express
const route = require("./routes/route");
const user = require("./model/model");
// Middleware for validation between client and the server
app.use(bodyParser.json()); // validate the json format while transfer of data
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/", route);
app.use(express.static(path.join(__dirname, "public")));
app.post("/createUser", async (req, res) => {
  console.log("coming");
  const user = await user.create(req.body);

  res.status(201).send(user);
});
app.get("/getAllUsers", async (req, res) => {
  const data = await user.find({});
});
axios.get("/").then().catch();

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
//
