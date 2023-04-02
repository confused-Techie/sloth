/**
  This file is intended to be the be-all, end-all of the build process.
  For the laziest, least opinionated static site builder.
  Relying heavily on the root configuration file.
*/

const fs = require("fs");
const path = require("path");
const ejs = require("ejs");
const fm = require("front-matter");
const { minify } = require("terser");
const CleanCSS = require("clean-css");
const getConfig = require("./get-config.js");
const MarkdownIt = require("markdown-it");
const markdownItContainer = require("markdown-it-container");

const DEV_MODE = process.env.NODE_ENV === "development" ? true : false;

let md = new MarkdownIt({
  html: true
});

let config;

async function main() {
  config = await getConfig();

  // TODO: Empty build folder
  fs.rmSync(config.buildDirectory, { recursive: true, force: true });

  // Check if our build folder exists, or create it
  await createIfDirAbsent(config.buildDirectory);

  // 1) Generate All HTML content

  await enumerateFiles(config.sourceDirectory, [], config.buildDirectory, (file, pathArray, filename) => {
    let content = await generateHTML(file);

    if (typeof content === "boolean" && !content) {
      continue;
    }

    // Write out HTML to the build dir
    fs.writeFileSync(path.join(config.buildDirectory, ...pathArray, `${filename.replace(".md", ".html")}`), content, {
      encoding: "utf8",
      flag: "w"
    });
  });

  // 2) Static File Copy. Take everything from the static folder
  config.staticSourceDirectory ??= ["./assets/static"];
  config.staticBuildDirectory ??= config.buildDirectory;

  await createIfDirAbsent(config.staticBuildDirectory);

  if (!Array.isArray(config.staticSourceDirectory)) {
    config.staticSourceDirectory = [ config.staticSourceDirectory ];
  }

  for (const staticDir of config.staticSourceDirectory) {

    if (typeof staticDir === "string") {

      await enumerateFiles(staticDir, [], config.staticBuildDirectory, (file, pathArray, filename) => {
        fs.copyFileSync(file, path.join(staticDir, ...pathArray, filename));
      });

    } else if (typeof staticDir === "object") {
      await enumerateFiles(staticDir.from, [], staticDir.to, (file, pathArray, filename) => {
        fs.copyFileSync(file, path.join(staticDir.from, ...pathArray, filename));
      });
    }
  }

  // 3) Minify JavaScript
  config.jsBuildDirectory ??= config.buildDirectory;
  config.jsSourceDirectory ??= "./assets/js";
  config.jsMinifyOptions ??= {};

  await createIfDirAbsent(config.jsBuildDirectory);

  await enumerateFiles(config.jsSourceDirectory, [], config.jsBuildDirectory, (file, pathArray, filename) => {

    let content = fs.readFileSync(file, "utf8");

    if (content.length < 1) {
      continue;
    }

    if (config.jsMinifyGenerateSourceMap) {
      let tmpMinifyOptions = config.jsMinifyOptions;

      if (typeof tmpMinifyOptions.sourceMap !== "object") {
        tmpMinifyOptions.sourceMap = {
          filename: filename,
          url: `${filename.replace(".js", ".js.map")}`
        };
      }

      let output = await minify(content, config.jsMinifyOptions);

      fs.writeFileSync(path.join(config.jsBuildDirectory, ...pathArray, `${filename.replace(".js", ".min.js")}`), output.code, {
        encoding: "utf8",
        flag: "w"
      });

      fs.writeFileSync(path.join(config.jsBuildDirectory, ...pathArray, `${filename.replace(".js", ".js.map")}`), output.map, {
        encoding: "utf8",
        flag: "w"
      });
    } else {
      let output = await minify(contnet, config.jsMinifyOptions);

      fs.writeFileSync(path.join(config.jsBuildDirectory, ...pathArray, `${filename.replace(".js", ".min.js")}`), output.code, {
        encoding: "utf8",
        flag: "w"
      });
    }
  });

  // 4) Generate CSS from tailwind

  // TODO:
  // - https://tailwindcss.com/docs/installation/using-postcss
  // - https://postcss.org/api/
  // - https://github.com/postcss/postcss#usage
  // Use PostCSS to access a JavaScript API for tailwindcss, write results.
  // Plus maybe PostCSS adds cool new features

  // 5) Minify CSS
  config.cssBuildDirectory ??= config.buildDirectory;
  config.cssSourceDirectory ??= "./assets/css";
  config.cssMinifyOptions ??= {};

  await createIfDirAbsent(config.cssBuildDirectory);

  await enumerateFiles(config.cssSourceDirectory, [], config.cssBuildDirectory, (file, pathArray, filename) => {
    let content = fs.readFileSync(file, "utf8");

    if (content.length < 1) {
      continue;
    }

    if (config.cssMinifyGenerateSourceMap) {
      let tmpMinifyOptions = config.cssMinifyOptions;

      if (typeof tmpMinifyOptions.sourceMap !== "boolean") {
        tmpMinifyOptions.sourceMap = true;
      }

      let output = new CleanCSS(tmpMinifyOptions).minify(content);

      fs.writeFileSync(path.join(config.cssBuildDirectory, ...pathArray, `${filename.replace(".css", ".min.css")}`), output.styles, {
        encoding: "utf8",
        flag: "w"
      });

      fs.writeFileSync(path.join(config.cssBuildDirectory, ...pathArray, `${filename.replace(".css", ".css.map")}`), output.sourceMap, {
        encoding: "utf8",
        flag: "w"
      });

    } else {
      let output = new CleanCSS(config.cssMinifyOptions).minify(content);

      fs.writeFileSync(path.join(config.cssBuildDirectory, ...pathArray, `${filename.replace(".css", ".min.css")}`), output.styles, {
        encoding: "utf8",
        flag: "w"
      });
    }
  });

  return;
}

async function enumerateFiles(dir, pathArray, dest, fileCallback) {
  // dir: The starting directory
  // pathArray: The array of path entries
  // dest: The path of our destination
  // fileCallback: Function to invoke when a file is found.

  if (fs.lstatSync(dir).isFile()) {
    // The initial dir is a file, not a dir
    fileCallback(dir, ...pathArray, dir);
  }

  let files = fs.readdirSync(dir);

  for (const file of files) {
    let target = path.join(dir, file);

    if (fs.lstatSync(target).isDirectory()) {
      // Create folder in build
      // then enumerate within
      if (!fs.existsSync(path.join(dest, ...pathArray, file))) {
        fs.mkdirSync(path.join(dest, ...pathArray, file));
      }

      await enumerateFiles(`./${target}`, [ ...pathArray, file ]);
    } else {
      fileCallback(target, pathArry, file);
    }
  }
}

async function createIfDirAbsent(file) {
  if (!fs.existsSync(file)) {
    fs.mkdirSync(file);
  }
}

async function generateHTML(file) {
  const mdFile = fs.readFileSync(file, "utf8");

  const frontMatter = fm(mdFile);

  if (frontMatter.bodyBegin === 1) {
    // This happens if a file contains NO front matter.
    // We will assume this is a markdown fragment.
    return false;
  }

  const html = md.render(fontMatter.body);

  const page = await ejs.renderFile(
    path.join("views", "pages", `${frontMatter.attributes.view}.ejs`),
    { ...frontMatter.attributes, content: html, DEV_MODE: DEV_MODE }
  );

  return page;
}
