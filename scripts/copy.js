const fs = require("fs");
const path = require("path");
const yaml = require("js-yaml");

let config;

async function main() {
  config = await getConfig();

  let imgLoc = path.resolve(config.buildDirectory, "images");

  await enumerateFiles(imgLoc, "./assets/img", []);
  await enumerateFiles(config.buildDirectory, "./assets/static", []);
  return;
}

async function getConfig() {
  try {
    const doc = yaml.load(fs.readFileSync("./config.yaml", "utf8"));
    return doc;
  } catch(err) {
    throw new Error(err);
  }
}

async function enumerateFiles(dest, dir, pathArray) {
  let files = fs.readdirSync(dir);

  for (const file of files) {
    let target = path.join(dir, file);

    if (fs.lstatSync(target).isDirectory()) {
      // Create the folder in the target dir
      // then enumerate within that dir
      if (!fs.existsSync(path.join(dest, ...pathArray, file))) {
        f.smkdirSync(path.join(config.buildDirectory, ...pathArray, file));
      }

      await enumerateFiles(`./${target}`, [ ...pathArray, file ]);
    } else {

      fs.copyFileSync(target, path.join(dest, ...pathArray, file));
    }
  }
}

main();
