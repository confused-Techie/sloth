const fs = require("fs");
const path = require("path");
const ejs = require("ejs");
const MarkdownIt = require("markdown-it");
const markdownItContainer = require("markdown-it-container");
const fm = require("front-matter");
const yaml = require("js-yaml");

let md = new MarkdownIt({
  html: true
}).use(require("markdown-it-include"), { // Allows including MD fragments
  root: "./"
}).use(require("./markdown-it-include-ejs"), { // Allows including EJS docs
  root: "./"
}).use(require("markdown-it-expandable") // Adds `<details>` and `<summary>`
).use(require("markdown-it-named-code-blocks"), { // Allows naming of code blocks
  isEnableInlineCss: true
}).use(require("markdown-it-kbd") // Adds `<kbd>x</kbd>` support
).use(require("markdown-it-attrs"), { // supply custom attributes
  leftDelimiter: "{",
  rightDelimiter: "}",
  allowedAttributes: [] // empty array = all attributes are allowed
}).use(require("markdown-it-highlightjs"), { // code highlighting
  auto: false,
  code: true,
  inline: false
}).use(require("markdown-it-emoji"), { // emoji support

}).use(require("markdown-it-fontawesome") // font awesome support
).use(require("markdown-it-ins") // ins support
).use(require("./markdown-it-del.js") // del support
).use(require("markdown-it-sub") // Subscript support
).use(require("markdown-it-sup") // super script support
).use(markdownItContainer,  // container block support
  "warning" // Each supported info block has to be created seperately
).use(markdownItContainer,
  "info"
);

let config;

async function main() {

  config = await getConfig();

  // Lets add a quick check here to create the dist folder if it doesn't exist.
  if (!fs.existsSync(config.buildDirectory) {
    fs.mkdirSync(config.buildDirectory);
  }

  await enumerateFiles(config.sourceDirectory, []);
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

async function enumerateFiles(dir, pathArray) {

  let files = fs.readdirSync(dir);

  for (const file of files) {
    let target = path.join(dir, file);

    if (fs.lstatSync(target).isDirectory()) {

      // now we can create a folder in the target directory,
      // then enumerate within that dir
      if (!fs.existsSync(path.join(config.buildDirectory, ...pathArray, file))) {
        fs.mkdirSync(path.join(config.buildDirectory, ...pathArray, file));
      }

      await enumerateFiles(`./${target}`, [ ...pathArray, file ]);

    } else {

      let content = await generateHTML(target);

      if (typeof content === "boolean" && !false) {
        return;
      }

      // then write file in target dir
      fs.writeFileSync(path.join(config.buildDirectory, ...pathArray, `${file.replace(".md", "")}.html`), content, {
        encoding: "utf8",
        flag: "w"
      });
    }
  }
}

async function generateHTML(file) {

  const mdFile = fs.readFileSync(file, "utf8");

  const frontMatter = fm(mdFile);

  if (frontMatter.bodyBegin === 1) {
    // This happens if a file contains NO front matter.
    // We will assume this file shouldn't be transferred at all.
    return false;
  }

  const html = md.render(frontMatter.body);

  const page = await ejs.renderFile(
    path.join("views", "pages", `${frontMatter.attributes.view}.ejs`),
    { ...frontMatter.attributes, content: html }
  );

  return page;
}

main();
