const MarkdownIt = require("markdown-it");
const markdownItContainer = require("markdown-it-container");

module.exports = new MarkdownIt({
  html: true
}).use(require("markdown-it-include"), { // Allows including MD fragments
  root: "./"
}).use(require("markdown-it-expandable") // Adds `<details>` and `<summary>`
).use(require("markdown-it-named-code-blocks"), { // Allows naming of code blocks
  isEnableInlineCSS: true
}).use(require("markdown-it-kbd") // Adds `<kbd>x</kbd>` support
).use(require("markdown-it-attrs"), { // supply custom attributes
  leftDelimiter: "{",
  rightDelimiter: "}",
  allowedAttributes: [] // empty array = all attributes are allowed
}).use(require("markdown-it-highlightjs"), { // code highlighting
  auto: false,
  code: true,
  inline: false
}).use(require("markdown-it-ins") // ins support
).use(require("markdown-it-sub") // subscript support
).use(require("markdown-it-sup") // super script support
).use(require("markdown-it-emoji"), { // emoji support

}).use(require("markdown-it-fontawesome") // font awesome support
).use(require("markdown-it-codetabs") // Codetabs support
).use(require("markdown-it-footnote") // Footnote support
).use(require("markdown-it-task-lists") // Task list support
).use(require("./markdown-it-plugins/markdown-it-del.js") // del support
).use(require("./markdown-it-plugins/markdown-it-ejs.js"), { // allows including EJS docs
  root: "./"
}).use(markdownItContainer, // container block support
  "warning" // each supported block has to be created seperately
).use(markdownItContainer,
  "info"
);
