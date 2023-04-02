const express = require("express");
const fs = require("fs");
const yaml = require("js-yaml");

const app = express();

const port = getConfig().devPort ?? 8080;

function getConfig() {
  try {
    const doc = yaml.load(fs.readFileSync("./config.yaml", "utf8"));
    return doc;
  } catch(err) {
    throw new Error(err);
  }
}

app.use("/", express.static("dist"));

app.listen(port, () => {
  console.log(`Site is listening on port: ${port}`);
});
