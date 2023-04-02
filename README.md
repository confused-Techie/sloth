# Pulsar-Docs

A simple Proof of Concept at owning our own website framework.

Up until now, the main website of Pulsar has been running on Vuepress, with some plugins, and themes.

And while that was amazing to get us up and running as fast as possible, it's ended up quickly becoming tech debt.
While many of the issues faced are easier to solve, some are not, and when mixed all together it makes for a subpar development experience.

Since there was a lot we wanted our site to do, it required quite a bit of customizations, but as with everything in the JavaScript ecosystem, backwards compatibility was not a priority, and things quickly become very difficult to update or extend.

So that's why this Proof of Concept has been created. This static site builder is an attempt at creating the least opinionated, laziest static site builder.

It's only focus is taking your raw data and turning it into a website. If you want cool features, then you'll need to implement them.

---

When you ask the `./scripts/build.js` script to create your website it does the following:

* Mirrors the data structure of folders and files from `./docs/` into `./dist/`.
* Takes all markdown documents (that contain a front matter) and turns them into HTML documents, saving them with the same name, in the same directory.
* When converting your markdown documents into HTML, a number of plugins will be used when doing so to enable support for as massive a feature set as possible.
* Once your markdown is converted into HTML, it will be combined with your EJS view from `./views` based on the view specified in the markdown frontmatter.

That it. The build script here is rather very simple, just converting data with the help of an army of `markdown-it` plugins.

The other features come from other tools used alongside this.

When the `npm run build` script is executed the following happens:

* `tailwindcss` is used to convert your `site.css` file from `./assets/css/site.css` into a proper CSS file and places it into `./dist/site.css`.
* `minify` is used to minify some files and place them into the appropriate directories.
  - Minifying `./assets/js/site.js` and placing it into `./dist/site.min.js`
  - Minifying `./dist/site.css` and placing it into `./dist/site.min.css`
* Executes the above mentioned build process on all Markdown.
* Additionally executes the `./scripts/copy.js` file, which copies some data from your `./assets` folder to the `./dist` folder.
  - Copies `./assets/img` content to `./dist/images/`
  - Copies `./assets/static` content to `./dist/` (Purposefully at the root directory of `./dist` since it's recommended to place `robots.txt` and such in the static folder.)

With this process you can turn some simple CSS, JS, EJS Views, and Markdown into a fully properly structured site of HTML, minified JavaScript, and minified CSS.

## Developing

When developing the site you can run `npm run start:dev` which will kick off the whole build process, while watching for changes which will reload the whole process, and starts `./scripts/dev.js` which is a super simple ExpressJS server that exposes the whole directory statically. The same way GitHub pages would, so that you can view the website you are creating.

And any changes from Markdown, CSS, JavaScript, and EJS will only need a simple refresh to take effect. You can even modify the build script for the whole site, and it will be automatically refreshed to show your changes.

## Structure

* `views/` contains your EJS templates. When using includes within a template it's best to use a path from the root of the repo.
* `views/pages/` contains full pages for an EJS template. When writing a Markdown file and specifying the EJS template to use, it must be a full page from this directory.
* `views/partials/` the recommended directory for EJS fragments.
* `docs/` The recommended location to place your markdown files. This can be changed via your `config.yaml` `sourceDirectory` config.
* `assets/` The location for all asset files to be placed.
* `assets/css/` The folder for your `site.css`
* `assets/js/` The folder for your `site.js`
* `assets/img/` The folder for images to be placed.
* `assets/static/` The folder for static data to be placed.
* `scripts/` The folder that contains build process tooling.
* `config.yaml` The configuration file of the build process.

## Markdown Frontmatter

Your frontmatter of your Markdown documents is important, and directs some aspects of the build process.

It's important to remember that a file will only be assumed to be a valid HTML page, if it contains frontmatter data. If the frontmatter is not included, it's assumed that it should not be in the final output, and is part of a markdown fragment.

When writing your Frontmatter some important notes:
* No key of your frontmatter can be named `content` this is the key the body of your markdown is assigned when handed to the EJS templating engine.
* The data in your frontmatter is available to the EJS templating engine, so that placing a frontmatter field of `title: Hello World` is then available within an EJS view as `<%=title%>`.
* Any valid YAML may exist within your frontmatter, providing as many features as you'd like to your EJS template.

## Config File

The configuration of the build script is located in `config.yaml` in the root of the repo.

Within it there are a few values used to direct the whole the process:

* `sourceDirectory` The string path of where your Markdown documents reside.
* `buildDirectory` The string path of where to place your built files.
* `devPort` An optional numeric port to use when running the developer browser.

## EJS Templates

Your EJS templates are largely the same as you'd find in any other setup. The most important notes:

* You can check if `DEV_MODE` is true or false to change your `dist` output from when running locally or when building the application for production.
* Any variables you need to build a specific instance of a page is defined via the frontmatter of your Markdown document.
* To access the main Markdown Body as HTML within an EJS template simply use `<%- content %>` to apply it to the page.

# Supported Markdown Extensions

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

A note, the EJS script that's imported should not use any variables as they will
not retain the context, and will be parsed as standard HTML.

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

## `markdown-it-sub`

* [NPM](https://www.npmjs.com/package/markdown-it-sub)
* [GitHub](https://github.com/markdown-it/markdown-it-sub)

Markdown-it plugin providing subscript support.

`H~2~0` => `H<sub>2</sub>0`

## `markdown-it-sup`

* [NPM](https://www.npmjs.com/package/markdown-it-sup)
* [GitHub](https://github.com/markdown-it/markdown-it-sup)

Markdown-it plugin for Superscript support.

`29^th^` => `29<sup>th</sup>`

## `markdown-it-container`

* [NPM](https://www.npmjs.com/package/markdown-it-container)
* [GitHub](https://github.com/markdown-it/markdown-it-container)

Markdown-it plugin for creating block-level custom containers.

Each supported container has to be created individually.

```markdown
::: info
Some Text
:::
```

Supported container types:
* `info`
* `warning`

## `markdown-it-ins`

* [NPM](https://www.npmjs.com/package/markdown-it-ins)
* [GitHub](https://github.com/markdown-it/markdown-it-ins)

Markdown-it plugin for `<ins>` support.

`++inserted++` => `<ins>inserted</ins>`

## `markdown-it-del`

Custom plugin, that lives `./scripts/markdown-it-del.js`.

Mirrored from `markdown-it-ins` supports the `<del>` element.

`--deleted--` => `<del>deleted</del>`
