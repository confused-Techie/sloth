const express = require("express");
const fs = require("fs");
const config = require("../site.config.js").config;

const app = express();

let serve;

const port = config.devPort ?? 8080;

app.use("/", express.static("dist"));

function startListener() {
  try {
    serve = app.listen(port, () => {
      console.log(`Dev site running at: http://localhost:${port}/`);
    });
  } catch(err) {
    if (err.code === "EADDRINUSE") {
      port = port + 1;
      startListener();
    } else {
      console.error(err);
      process.exit(100);
    }
  }
}

startListener();

process.on("SIGTERM", async () => {
  console.log("SIGTERM signal received. Shutting down...");
  serve.close(() => {
    console.log("HTTP Server closed.");
  });
});

process.on("SIGINT", async () => {
  console.log("SIGINT signal received. Shutting down...");
  serve.close(() => {
    console.log("HTTP Server closed.");
  });
});
