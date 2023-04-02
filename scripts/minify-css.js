const CleanCSS = require("clean-css");
const getConfig = require("./get-config.js");
const fs = require("fs");
const path = require("path");

let config;

async function main() {
  config = await getConfig();

  config.cssBuildDirectory ??= config.buildDirectory;
  config.cssSourceDirectory ??= "./assets/css";
  config.cssMinifyOptions ??= {};

  // Quick check to ensure dist exists
  if (!fs.existsSync(config.cssBuildDirectory)) {
    fs.mkdirSync(config.cssBuildDirectory);
  }

  await enumerateFiles(config.cssSourceDirectory, []);
  return;
}

async function enumerateFiles(dir, pathArray) {
  let files = fs.readdirSync(dir);

  for (const file of files) {
    let target = path.join(dir, file);

    if (fs.lstatSync(target).isDirectory()) {
      // now we can create the required folder in the target directory
      // then enumerate within that dir
      if (!fs.existsSync(path.join(config.cssBuildDirectory, ...pathArray, file))) {
        fs.mkdirSync(path.join(config.cssBuildDirectory, ...pathArray, file));
      }

      await enumerateFiles(`./${target}`, [ ...pathArray, file]);
    } else {

      let content = fs.readFileSync(target, "utf8");

      if (content.length < 1) {
        continue;
      }

      if (config.cssMinifyGenerateSourceMap) {

        let tmpMinifyOptions = config.cssMinifyOptions;

        if (typeof tmpMinifyOptions.sourceMap !== "boolean") {
          tmpMinifyOptions.sourceMap = true;
        }

        let output = new CleanCSS(tmpMinifyOptions).minify(content);

        fs.writeFileSync(path.join(config.cssBuildDirectory, ...pathArray, `${file.replace(".css", "")}.min.css`), output.styles, {
          encoding: "utf8",
          flag: "w"
        });

        fs.writeFileSync(path.join(config.cssBuildDirectory, ...pathArray, `${file.replace(".css", "")}.css.map`), output.sourceMap, {
          encoding: "utf8",
          flag: "w"
        });

      } else {
        let output = new CleanCSS(config.cssMinifyOptions).minify(content);

        fs.writeFileSync(path.join(config.cssBuildDirectory, ...pathArray, `${file.replace(".css", "")}.min.css`), output.styles, {
          encoding: "utf8",
          flag: "w"
        });
        
      }
    }
  }
}

main();
