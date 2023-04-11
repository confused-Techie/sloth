const express = require("express");
const fs = require("fs");
const config = require("../site.config.js").config;

const app = express();

let serve;

let port = config.devPort ?? 8080;

app.use("/", express.static("dist"));

function startListener() {
  serve = app.listen(port, () => {
    console.log(`Dev site running at: http://localhost:${port}/`);
  });
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

process.on("unhandledRejection", async (err, origin) => {
  console.error(err);
  process.exit(100);
});

process.on("uncaughtException", async (err, origin) => {
  if (
    err.code === "EADDRINUSE" || // POSIX Error Constant
    err.code === "WSAEADDRINUSE" || // Windows Specific Error Constant
    err.code === "EADDRNOTAVAIL" || // POSIX Error Constant Address unavailable for use
    err.code === "WSAEADDRNOTAVAIL" // Windows Specific Error Constant address unavailable
  ) {
    console.log(`Port ${port} is in use, increasing port number by one...`);
    port = port + 1;
    startListener();
  } else {
    console.error(err);
    process.exit(25);
  }
});
