const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 5000;
const toys = require("./data.json");

// middleware
app.use(cors());

app.get("/toys", (req, res) => {
  res.send(toys);
});

app.listen(port, () => {
  console.log(`toy market place is running on port: ${port}`);
});
