const fs = require("fs");
const path = require("path");
const ejs = require("ejs");
const MarkdownIt = require("markdown-it");
const fm = require("front-matter");

let md = new MarkdownIt({
  html: true
});

async function main() {

  const rootDir = "./docs";

  await enumerateFiles(rootDir);
  return;
}

async function enumerateFiles(dir) {
  console.log(`enumerateFiles called: ${dir}`);
  let files = fs.readdirSync(dir);
  console.log(files);

  for (const file of files) {
    let target = path.join(dir, file);

    if (fs.lstatSync(target).isDirectory()) {
      console.log(`${target} is dir`);

      // now we can create a folder in the target directory,
      // then enumerate within that dir
      fs.mkdirSync(path.join("dist", file));

      await enumerateFiles(`./${target}`);

    } else {
      console.log(`else with: ${target}`);

      let content = await generateHTML(target);

      // then write file in target dir
      fs.writeFileSync(path.join("dist", `${file.replace(".md", "")}.html`), content);
    }
  }
}

async function generateHTML(file) {

  const mdFile = fs.readFileSync(file, "utf8");

  const frontMatter = fm(mdFile);

  const html = md.render(frontMatter.body);

  const page = await ejs.renderFile(
    path.join("views", "pages", `${frontMatter.attributes.view}.ejs`),
    { ...frontMatter.attributes, content: html }
  );

  return page;
}

main();
