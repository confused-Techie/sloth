// This file is used only to remove the build directory from the gitignore file.
// This is because when commiting the pages build script, the dist directory is likely
// ignored for local development.

const fs = require("fs");
const path = require("path");
const yaml = require("js-yaml");

async function main() {
  config = await getConfig();

  let dist = config.buildAsInIgnore;

  let ignore = fs.readFileSync("./.gitignore", "utf8");

  ignore = ignore.replace(dist, "");

  fs.writeFileSync("./.gitignore", ignore, {
    encoding: "utf8",
    flag: "w"
  });
}

async function getConfig() {
  try {
    const doc = yaml.load(fs.readFileSync("./config.yaml", "utf8"));
    return doc;
  } catch(err) {
    throw new Error(err);
  }
}

main();
