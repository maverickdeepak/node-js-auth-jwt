const express = require("express");
const app = express();
const PORT = 8800;
const authRoutes = require("./routes/auth");
const collectionsRoutes = require("./routes/collections");

// middleware for use JSON in express app
app.use(express.json());

app.get("/", function (req, res) {
  res.send("Welcome to JWT Authentication App.");
});

app.use("/auth", authRoutes);
app.use("/collections", collectionsRoutes);

app.get("*", function (req, res) {
  res.status(404).send("page not found");
});

app.listen(PORT, function () {
  console.log(`server is running at port ${PORT}`);
});
