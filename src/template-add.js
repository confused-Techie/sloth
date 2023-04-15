const fs = require("fs");
const path = require("path");

async function templateAdd(opt, config) {
  if (config.templates[opt.name]) {

    // Then lets check if the user has specified where they want this item.
    if (typeof config.templates[opt.name] === "string") {
      // Since it's a string, that means they have specified a path
      console.log(path.resolve(path.join(config.templates[opt.name], opt.file)));
      fs.copyFileSync(
        path.join(__dirname, "../static-assets", opt.file),
        path.resolve(path.join(config.templates[opt.name], opt.file))
      );

    } else if (typeof config.templates[opt.name] === "boolean") {
      // They have not specified a path, only that it should be included.
      fs.copyFileSync(
        path.join(__dirname, "../static-assets", opt.file),
        path.resolve(path.join(config.buildDirectory, opt.file))
      );

    }
  }
}

module.exports = templateAdd;
