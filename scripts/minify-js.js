const { minify } = require("terser");
const getConfig = require("./get-config.js");
const fs = require("fs");
const path = require("path");

let config;

async function main() {
  config = await getConfig();

  config.jsBuildDirectory ??= config.buildDirectory;
  config.jsSourceDirectory ??= "./assets/js";
  config.jsMinifyOptions ??= {};

  // Quick check to ensure dist exists
  if (!fs.existsSync(config.jsBuildDirectory)) {
    fs.mkdirSync(config.jsBuildDirectory);
  }

  await enumerateFiles(config.jsSourceDirectory, []);
  return;
}

async function enumerateFiles(dir, pathArray) {
  let files = fs.readdirSync(dir);

  for (const file of files) {
    let target = path.join(dir, file);

    if (fs.lstatSync(target).isDirectory()) {
      // now we can create the required folder in the target directory
      // then enumerate within that dir
      if (!fs.existsSync(path.join(config.jsBuildDirectory, ...pathArray, file))) {
        fs.mkdirSync(path.join(config.jsBuildDirectory, ...pathArray, file));
      }

      await enumerateFiles(`./${target}`, [ ...pathArray, file ]);
    } else {

      let content = fs.readFileSync(target, "utf8");

      if (content.length < 1) {
        continue;
      }

      if (config.jsMinifyGenerateSourceMap) {

        let tmpMinifyOptions = config.jsMinifyOptions;

        if (typeof tmpMinifyOptions.sourceMap !== "object") {
          tmpMinifyOptions.sourceMap = {
            filename: file,
            url: `${file.replace(".js", "")}.js.map`
          };
        }

        let output = await minify(content, config.jsMinifyOptions);

        fs.writeFileSync(path.join(config.jsBuildDirectory, ...pathArray, `${file.replace(".js", "")}.min.js`), output.code, {
          encoding: "utf8",
          flag: "w"
        });

        fs.writeFileSync(path.join(config.jsBuildDirectory, ...pathArray, `${file.replace(".js", "")}.js.map`), output.map, {
          encoding: "utf8",
          flag: "w"
        });

      } else {
        let output = await minify(content, config.jsMinifyOptions);

        fs.writeFileSync(path.join(config.jsBuildDirectory, ...pathArray, `${file.replace(".js", "")}.min.js`), output.code, {
          encoding: "utf8",
          flag: "w"
        });

      }

    }
  }
}

main();
