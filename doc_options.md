# esbuild

Seems they do successfully take JSX and turn it into JavScript that returns HTML content.

This could be used to create a website. But might be a little awkward.

# webpack

Seems to focus on something else totally.


# Emotion
Should absolutely be used for CSS


# React-Dom/Server
Could be used to convert JSX into HTML strings,

Maybe injected into EJS which can finally be compiled

---

The idea:

* We use primarily MDX to draft documents
* Also use JSX for crafting the other aspects of the page
* Then we can use EJS for the overarching design of the website
* Afterwards write it all to disk in the proper structure

Then serve it over GitHub pages

---

Whats needed:

* EJS views
These will need their partials, and pages
* JSX
Likely in a components folder
* Documents
Could likely all be in `docs/` folder, as optional MDX or MD
* Config
Could likely be a folder or just a `config.json` file or yaml or anything
* Assets
An `assets/` folder containing CSS and JS to be loaded client side
* Build Scripts
Likely `scripts/` that contain the logic needed to build the site

That is

`views/`
  `partials/`
  `pages/`
`docs/`
  `user defined data`
`assets/`
  `user defined data`
`scripts/`
  `the data needed to build the site`
`config.js`

---

Then essentially the process could be like so:

We get all the files within the docs folder (which is the content of the website)

That content could then be enumerated, have the HTML generated, and saved in place, using the same name, with `.html` and deleting the markdown documents.

Or it could even be saved to a new folder `dist/` (Yes this is better) mirroring the file structure.

Then the website is served from `dist/`

Now to generate each page:

- We read the markdown file
- we extract it's frontMatter data, which helpfully then has an object for the `body` of the page
- We take the body, and pass it to the ejs view defined within the yaml-frontmatter of the page.
- Then the EJS view is compiled, able to require whatever else it wants.
- Finally now we have an HTML page.

Some notes:

* When compiling the EJS page, we have to pass the structured data into the page.
  So the yaml-frontmatter will have to be strict. Or actually nvm, just pass them all and make the page author care.

With this structure, the only unsolved part is supporting JSX either within the EJS script, or within the markdown.

But markdown-it has a plugin for MDX, and the EJS could be handled by having a special function called to include JSX output in the EJS, much the same way the front-end social-card microservice passes a special function into the EJS compiling, that allows it to compile JSX and return it.

---

# Markdown Extensions

## `markdown-it-include`

* [NPM](https://www.npmjs.com/package/markdown-it-include)
* [GitHub](https://github.com/camelaissani/markdown-it-include)

Markdown-it plugin which adds the ability to include markdown fragment files.

The default configuration will require specifying a fully path to the fragment, from the root of the repo.

```markdown
!!!include(docs/micro.md)!!!
```

## `markdown-it-include-ejs`

This is a custom plugin, that lives in `./scripts/markdown-it-include-ejs.js`.

Which allows you to specify an EJS template to include into the page.

Again requires specifying the full path from the root of the repo.

```markdown
!!!includeEJS(views/partials/simple.ejs)!!!
```

## `markdown-it-expandable`

* [NPM](https://www.npmjs.com/package/markdown-it-expandable)
* [GitHub](https://github.com/bioruebe/markdown-it-collapsible)

Markdown-it plugin, which adds the HTML `<details>` and `<summary>` elements.

You are able to define these items either as default open, or default closed.

```markdown
+++ Click Me!
This Hidden text is open by default.
+++
```

## `markdown-it-named-code-blocks`

* [NPM](https://www.npmjs.com/package/@speedy-js/code-title)
* [GitHub](https://github.com/tsutsu3/markdown-it-named-code-blocks)

Markdown-it plugin to create named code blocks.

## `markdown-it-kbd`

* [NPM](https://www.npmjs.com/package/@gerhobbelt/markdown-it-kbd)
* [GitHub](https://github.com/jGleitz/markdown-it-kbd)

Markdown-it plugin for keystrokes.

Renders `[[x]]` as `<kbd>x</kbd>`.

## `markdown-it-attrs`

* [NPM](https://www.npmjs.com/package/markdown-it-attrs)
* [GitHub](https://github.com/arve0/markdown-it-attrs)

Markdown-it plugin that allows adding classes, identifiers and attributes to markdown.

```markdown
Some Text {.class #identifier attr=value attr2="spaced value"}
```

## `markdown-it-highlightjs`

* [NPM](https://www.npmjs.com/package/markdown-it-highlightjs)
* [GitHub](https://github.com/valeriangalliat/markdown-it-highlightjs)

Markdown-it plugin to use `highlight.js`.

Provides code highlighting to code blocks.

## `markdown-it-emoji`

* [NPM](https://www.npmjs.com/package/markdown-it-emoji)
* [GitHub](https://github.com/markdown-it/markdown-it-emoji)

Markdown-it plugin adding emoji & emoticon syntax support.

Use something like `:smiley:` to output 😃. Also supports emoticon shortcuts like `:)`.

Valid emoji [list](https://gist.github.com/rxaviers/7360908).

## `markdown-it-fontawesome`

* [NPM](https://www.npmjs.com/package/markdown-it-fontawesome)
* [GitHub](https://github.com/nunof07/markdown-it-fontawesome)

Markdown-it plugin that adds Font Awesome icons support.

```markdown
Hello World! :fa-flag:

- [:fa-google: Google](https://www.google.com/)
```
