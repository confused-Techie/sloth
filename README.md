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

Which follows a strict lifecycle.

0) The Build Folder is completely emptied.
1) HTML content is generated using Markdown, and EJS Templates.
    To add more to this, every valid page is first looped through and processed, generating any additional variables and handling frontmatter. Once done then it is cycled through again to access every single page.
    This is done so that if needed, there is a way for every single page to have easy access to it's neighbor pages if needed.
2) Static Files are copied over according to your `staticSourceDirectory` config.
3) JavaScript is minified and placed in the build directory.
4) CSS is processed using `SCSS` and written to disk. Which is then minified using `CleanCSS`.

The majority of what's done in this lifecycle is then controlled by the `site.config.js` file, pointing out which directories contain what.

## Developing

When developing the site you can run `npm run start:dev` which will kick off the whole build process, while watching for changes which will reload the whole process, and starts `./scripts/dev.js` which is a super simple ExpressJS server that exposes the whole directory statically. The same way GitHub pages would, so that you can view the website you are creating.

And any changes from Markdown, CSS, JavaScript, and EJS will only need a simple refresh to take effect. You can even modify the build script for the whole site, and it will be automatically refreshed to show your changes.

## Other Projects Used

* [EJS](https://ejs.co/#promo) is used for templating HTML documents.
* [SASS](https://sass-lang.com/) is used to process all SCSS files and create CSS from them.
* [Terser](https://github.com/terser/terser) is used to minify JavaScript. With [any and all options](https://github.com/terser/terser#minify-options) supported in the config.
* [CleanCSS](https://github.com/clean-css/clean-css) is used to minify CSS. With [any and all options](https://github.com/clean-css/clean-css#constructor-options) supported in the config.
* [Markdown-IT](https://github.com/markdown-it/markdown-it) is used to process markdown documents.

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

* `sourceDirectory`: <string> The path to your source Markdown documents.
* `buildDirectory`: <string> The path of where to place markdown documents.
* `devPort`: <integer> The port of which to run the dev server on.
* `jsBuildDirectory`: <string> The path of where to place JavaScript files. Defaults to `buildDirectory`.
* `jsSourceDirectory`: <string> The path to your JavaScript source files. Defaults to `./assets/js`.
* `jsMinifyGenerateSourceMap`: <boolean> Whether or not to generate a source map for minified files.
* `jsMinifyOptions`: <object> The options that will be passed directly to `terser`.
* `cssBuildDirectory`: <string> The path of where to place CSS files. Defaults to `buildDirectory`.
* `cssSourceDirectory`: <string> The path to your SCSS files. Defaults to `./assets/css`.
* `cssMinifyGenerateSourceMap`: <boolean> Whether or not to generate a source map for minified files.
* `cssMinifyOptions`: <object> The options that will be passed directly to `CleanCSS`.
* `md`: <object> You can optionally specify a `md` object in the config, which will be used to override the `Markdown-IT` instance used to process markdown documents. Keep in mind setting this will remove all native markdown features.
* `staticBuildDirectory`: <string> The path to place static files.
* `staticSourceDirectory`: <*> This field is used to direct how any static files move from one directory to another.

  This could be any of the following:
    - A string of a path.
    - An array of strings of paths.
    - An array of objects each with a `to` and `from` keys specifying where a file should move `to` and where `from`.
      The `to` and `from` fields themselves can be a path directly to a file or to a directory. Where a directory will then copy the entire contents of that directory to the specified path.
    - Additionally the array could be a mix of objects and strings.

  Some common use cases here, and ones recommended to configure right out of the box could be:
    - Moving images to an images folder `{ from: "./assets/img", to: "./dist/images" }`
    - Moving files from a `node_module` `{ from: "./node_modules/dep/img.png", to: "./dist/images/img.png" }`

      But please note this should not be used for files that need to be processed. As once moved they will not receive any processing on them. If you need to include additional Markdown that should be done using the include feature of the markdown document, or if you need to include some CSS that should be done using the SCSS include feature.
* `sidebar`: This defines any global sidebar you'd like to have accessible in the EJS templates. This could either be an object directly listed in the config, or could be the relative path to a file. If it is a reference to a file the following file formats are currently supported:
  - `json`
* `defaultView`: Allows specifying the name of a default EJS view when the frontmatter of a doc doesn't specify one. Should only define the filename itself, without any extension. e.g. `./views/partials/home.ejs` => `"defaultView": "home"`
* `viewPagePath`: This is the path to your full EJS pages. By default `./views/pages`

## Markdown Frontmatter

Your frontmatter of your Markdown documents is important, and directs some aspects of the build process.

It's important to remember that a file will only be assumed to be a valid HTML page, if it contains frontmatter data. If the frontmatter is not included, it's assumed that it should not be in the final output, and is part of a markdown fragment.

When writing your Frontmatter some important notes:
* No key of your frontmatter can be named `content` this is the key the body of your markdown is assigned when handed to the EJS templating engine.
* The data in your frontmatter is available to the EJS templating engine, so that placing a frontmatter field of `title: Hello World` is then available within an EJS view as `<%=title%>`.
* Any valid YAML may exist within your frontmatter, providing as many features as you'd like to your EJS template.
* It's recommended to not begin any front matter values with '_' as that prefix is used by the Universally Available Frontmatter elements.

## EJS Templates

Your EJS templates are largely the same as you'd find in any other setup. The most important notes:

* You can check if `DEV_MODE` is true or false to change your `dist` output from when running locally or when building the application for production.
* Any variables you need to build a specific instance of a page is defined via the frontmatter of your Markdown document.
* To access the main Markdown Body as HTML within an EJS template simply use `<%- content %>` to apply it to the page.
* To allow your EJS templates to access extra variables that can't be defined in a normal YAML frontmatter, there is a set of Universally Available Frontmatter elements, that are injected to mimic the frontmatter variables that EJS templates can access. They are always prefixed with '_' and are the following:
  - `_timeToRead`: This is a value in minutes, of the estimated time to read the current page.
  - `_date`: This is the date the file was created.
  - `_sidebar`: This is the contents of any `sidebar` value added to the config.
  - `_markdown`: This is the full contents of the raw markdown document used to build the page.

# Supported Markdown Extensions

## `markdown-it-include`

* [NPM](https://www.npmjs.com/package/markdown-it-include)
* [GitHub](https://github.com/camelaissani/markdown-it-include)

Markdown-it plugin which adds the ability to include markdown fragment files.

The default configuration will require specifying a full path to the fragment, from the root of the repo.

A note, you should not use quotes in this path. It will likely fail to import if your path contains quotes.

```markdown
!!!include(docs/micro.md)!!!
```

## `markdown-it-include-ejs`

This is a custom plugin, that lives in `./scripts/markdown-it-include-ejs.js`.

Which allows you to specify an EJS template to include into the page.

Again requires specifying the full path from the root of the repo.

A note, the EJS script that's imported should not use any variables as they will
not retain the context, and will be parsed as standard HTML. This may mean it is best suited for importing banners, or other warnings that may appear multiple times throughout a document.

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

## `markdown-it-codetabs`

* [NPM](https://www.npmjs.com/package/markdown-it-codetabs)
* [GitHub](https://github.com/cncws/markdown-it-codetabs)

Code tabs plugin.

```markdown

```js [g1:JavaScript]
console.log("hello");
```

```py [g1:Python3]
print("hello")
```

```

## `markdown-it-footnote`

* [NPM](https://www.npmjs.com/package/markdown-it-footnote)
* [GitHub](https://github.com/markdown-it/markdown-it-footnote)

Footnotes plugin for `markdown-it`.

```markdown

Here is an inline note.^[Inline notes are easier to write, since you don't have
to pick an identifier.]

Here is a footnote reference,[^1] and another.[^longnote]

[^1]: Here is the footnote.
[^longnote]: Here's one with multiple blocks.
  Subsequent paragraphs are indented to show that they belong to the previous
  footnote.

```

## `markdown-it-task-lists`

* [NPM](https://www.npmjs.com/package/markdown-it-task-lists)
* [GitHub](https://github.com/revin/markdown-it-task-lists)

Adds tasklist support as per the [GFM extension](https://github.github.com/gfm/#task-list-items-extension-)

```markdown

- [x] foo
  - [ ] bar
  - [x] baz
- [ ] bim

```
