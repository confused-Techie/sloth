const express = require("express");
const fs = require("fs");
const config = require("../site.config.js").config;

const app = express();

const port = config.devPort ?? 8080;

app.use("/", express.static("dist"));

app.listen(port, () => {
  console.log(`Site is listening on port: ${port}`);
});
