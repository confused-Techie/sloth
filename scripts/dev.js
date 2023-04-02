const express = require("express");
const fs = require("fs");
const getConfig = require("./get-config.js");

const app = express();

const port = getConfig().devPort ?? 8080;

app.use("/", express.static("dist"));

app.listen(port, () => {
  console.log(`Site is listening on port: ${port}`);
});
