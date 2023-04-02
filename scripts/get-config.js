const yaml = require("js-yaml");
const fs = require("fs");

async function getConfig() {
  try {
    const doc = yaml.load(fs.readFileSync("./config.yaml", "utf8"));
    return doc;
  } catch(err) {
    throw new Error(err);
  }
}

module.exports = getConfig;
