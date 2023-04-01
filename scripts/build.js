const fs = require("fs");
const ejs = require("ejs");
const MarkdownIt = require("markdown-it");
const fm = require("front-matter");

let md = new MarkdownIt({
  html: true
});

function tmp() {
  // Test how our build would function

  const mdLoc = "./docs/index.md";

  const home = fs.readFileSync(mdLoc, "utf8");

  const frontMatter = fm(home);

  const homeHTML = md.render(frontMatter.body);

  console.log(homeHTML);

  console.log(frontMatter);

  const page = ejs.renderFile("./views/pages/home.ejs", { ...frontMatter.attributes, content: homeHTML });

  console.log(page);
}

tmp();
