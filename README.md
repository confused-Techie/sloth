# Pulsar-Docs

A simple Proof of Concept at owning our own website framework.

Up until now, the main website of Pulsar has been running on Vuepress, with some plugins, and themes.

And while that was amazing to get us up and running as fast as possible, it's ended up quickly becoming tech debt.
While many of the issues faced are easier to solve, some are not, and when mixed all together it makes for a subpar development experience.

Since there was a lot we wanted our site to do, it required quite a bit of customizations, but as with everything in the JavaScript ecosystem, backwards compatibility was not a priority, and things quickly become very difficult to update or extend.

So that's why this Proof of Concept has been created. This static site builder is an attempt at creating the least opinionated, laziest static site builder.

It's only focus is taking your raw data and turning it into a website. If you want cool features, then you'll need to implement them.

## Building

When you run `npm run build` it'll run the `./scripts/build.js` script, which then orchestrates the whole build process between all tools.

Which follows a scrict lifecycle.

0) The Build Folder is completely emptied.
1) HTML content is generated using Markdown, and EJS Templates.
2) Static Files are copied over according to your `staticSourceDirectory` config.
3) JavaScript is minified and placed in the build directory.
4) CSS is processed by `PostCSS` which utilizes `tailwindcss` as a plugin to apply all transformations while it's written to your build directory. Once complete, `CleanCSS` is used to minify the source file and write those to your build directory as well.

The majority of what's done in this lifecycle is then controlled by the `site.config.js` file, pointing out which directories contain what.

## Developing

When developing the site you can run `npm run start:dev` which will kick off the whole build process, while watching for changes which will reload the whole process, and starts `./scripts/dev.js` which is a super simple ExpressJS server that exposes the whole directory statically. The same way GitHub pages would, so that you can view the website you are creating.

And any changes from Markdown, CSS, JavaScript, and EJS will only need a simple refresh to take effect. You can even modify the build script for the whole site, and it will be automatically refreshed to show your changes.

## Other Projects Used

* [Tailwindcss](https://tailwindcss.com/) is used to build sitewide CSS off all CSS files used.
* [Tailwindcss/typography](https://tailwindcss.com/docs/typography-plugin) plugin provides quality typographic defaults.
* [EJS](https://ejs.co/#promo) is used for templating HTML documents.
* [Terser](https://github.com/terser/terser) is used to minify JavaScript. With [any and all options](https://github.com/terser/terser#minify-options) supported in the config.
* [CleanCSS](https://github.com/clean-css/clean-css) is used to minify CSS. With [any and all options](https://github.com/clean-css/clean-css#constructor-options) supported in the config.
* [PostCSS](https://github.com/postcss/postcss) is used to process your CSS file and hand it off to tailwindcss. While also allowing additional plugins to be used.

## Recommended Structure

The below is what's recommended to make things obvious to multiple people. But is all optional, and can be modified however you'd like.

* `views/` contains your EJS templates. When using includes within a template it's best to use a path from the root of the repo.
* `views/pages/` contains full pages for an EJS template. When writing a Markdown file and specifying the EJS template to use, it must be a full page from this directory.
* `views/partials/` the recommended directory for EJS fragments.
* `docs/` The recommended location to place your markdown files. This can be changed via your `config.yaml` `sourceDirectory` config.
* `assets/` The location for all asset files to be placed.
* `assets/css/` The folder for your `site.css`
* `assets/js/` The recommend folder for your JavaScript files. This can be changed via your `config.yaml` `jsSourceDirectory` config.
* `assets/img/` The folder for images to be placed.
* `assets/static/` The folder for static data to be placed.
* `scripts/` The folder that contains build process tooling.
* `site.config.js` The configuration file of the build process.

## Config File

The configuration of the build script is located in `config.yaml` in the root of the repo.

Within it there are a few values used to direct the whole the process:

* `sourceDirectory` The string path of where your Markdown documents reside.
* `buildDirectory` The string path of where to place your built files.
* `devPort` An optional numeric port to use when running the developer browser.

Additionally there are a few values related to building your JavaScript:
* `jsSourceDirectory` The string path of where your JavaScript files reside. Defaults to `./assets/js`.
* `jsBuildDirectory` The string path of where to place your minified JavaScript. Defaults to `buildDirectory`.
* `jsMinifyGenerateSourceMap` A boolean value, which if true will automatically configure the source map configuration for `terser`.
* `jsMinifyOptions` An object that will be directly passed to `terser` to control how JavaScript files are minified.

## Markdown Frontmatter

Your frontmatter of your Markdown documents is important, and directs some aspects of the build process.

It's important to remember that a file will only be assumed to be a valid HTML page, if it contains frontmatter data. If the frontmatter is not included, it's assumed that it should not be in the final output, and is part of a markdown fragment.

When writing your Frontmatter some important notes:
* No key of your frontmatter can be named `content` this is the key the body of your markdown is assigned when handed to the EJS templating engine.
* The data in your frontmatter is available to the EJS templating engine, so that placing a frontmatter field of `title: Hello World` is then available within an EJS view as `<%=title%>`.
* Any valid YAML may exist within your frontmatter, providing as many features as you'd like to your EJS template.

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
