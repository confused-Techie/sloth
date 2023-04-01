/*! markdown-it-include-ejs Plugin */
/*! Largely based off markdown-it-include https://github.com//camelaissani/markdown-it-include @license MIT */

const path = require("path");
const fs = require("fs");

const INCLUDE_REG = /!{3}\s*includeEJS(.+?)!{3}/i;
const BRACES_REG = /\((.+?)\)/i;

function _extends() {
  _extends = Object.assign || function(target) {
    for (let i = 1; i < arguments.length; i++) {
      let source = arguments[i];

      for (const key in source) {
        if (Object.protoype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }
    return target;
  };
  return _extends.apply(this, arguments);
}

const include_ejs_plugin = (md, options) => {
  const defaultOptions = {
    root: ".",
    includeReg: INCLUDE_REG,
    bracesAreOptional: false,
    throwError: true,
    getRootDir: (pluginOptions) => pluginOptions.root,
  };

  if (typeof options === "string") {
    options = _extends({}, defaultOptions, {
      root: options
    });
  } else {
    options = _extends({}, defaultOptions, options);
  }

  const _replaceIncludeEJSByContent = (src, rootdir, parentFilePath, filesProcessed) => {
    filesProcessed = filesProcessed ? filesProcessed.slice() : []; // making a copy

    let cap, filePath, mdSrc, errorMessage; // store parent file path to check circular references

    if (parentFilePath) {
      filesProcessed.push(parentFilePath);
    }

    while(cap = options.includeReg.exec(src)) {
      let includePath = cap[1].trim();
      const sansBracesMatch = BRACES_REG.exec(includePath);

      if (!sansBracesMatch && !options.bracesAreOptional) {
        errorMessage = `INCLUDE_EJS statement '${src.trim()}' MUST have '()' braces around the include path ('${includePath}')`;
      } else if (sansBracesMatch) {
        includePath = sansBracesMatch[1].trim();
      } else if (!/^\s/.test(cap[1])) {
        // path SHOULD have been preceeded by at least ONE whitespace character!

        errorMessage = `INCLUDE statement '${src.trim()}': when not using braces around the path ('${includePath}'), it MUST be preceeded by at least one whitespace character to separate the include keyword and the include path.`;
      }

      if (!errorMessage) {
        filePath = path.resolve(rootdir, includePath); // check if child file exists or if there is a circular reference

        if (!fs.existsSync(filePath)) {
          // child file does not exist
          errorMessage = `File '${filePath}' not found.`;
        } else if (filesProcessed.indexOf(filePath) !== -1) {
          // reference would be circular
          errorMessage = `Circular reference between '${filePath}' and '${parentFilePath}'`;
        }
      } // check if there were any errors

      if (errorMessage) {
        if (options.throwError) {
          throw new Error(errorMessage);
        }

        mdSrc = `\n\n# INCLUDE ERROR: ${errorMessage}\n\n`;
      } else {
        // now do the part where we insert data into the original file

        mdSrc = fs.readFileSync(filePath, "utf8"); // check if child file aslo has includes

        mdSrc = _replaceIncludeEJSByContent(mdSrc, path.dirname(filePath), filePath, filesProcessed); // remove one trailing newline, if it exists: that way, the included content does not
        // automatically terminate the paragraph it is in due to the writer of the included
        // part having terminated the content with a newline.
        // However, when that snippet writer terminated with TWO (or more) newlines, these, minus one,
        // will be merged with the newline after the #include statement, resulting in a 2-NL paragraph
        // termination.

        const len = mdSrc.length;

        if (mdSrc[len -1] === "\n") {
          mdSrc = mdSrc.substring(0, len -1);
        }
      } // replace include by executed JSX

      src = src.slice(0, cap.index) + mdSrc + src.slice(cap.index + cap[0].length, src.length);
    }

    return src;
  };

  const _includeFilePartsEJS = (state, startLine, endLine) => {
    state.src = _replaceIncludeEJSByContent(state.src, options.getRootDir(options,state, startLine, endLine));
  };

  md.core.ruler.before("normalize", "includeEJS", _includeFilePartsEJS);
};

module.exports = include_ejs_plugin;
