module.exports = (md, options) => {
  const proxy = (tokens, idx, options, env, self) => self.renderToken(tokens, idx, options);
  const defaultParagraphOpenRenderer = md.renderer.rules.paragraph_open || proxy;
  const defaultParagraphCloseRenderer = md.renderer.rules.paragraph_close || proxy;
  const defaultTextRenderer = md.renderer.rules.text || proxy;
  const REGEX = /(<%%|<%=|<%-|<%_|<%#)(.*)(%>|-%>|_%>)/;

  md.renderer.rules.paragraph_open = function(tokens, idx, options, env, self) {
    // Since any variables being handled will be part of a paragraph we check for the opening
    // of a paragraph.
    // Now we want to check if our next item matches some regex for variable or includes.

    if (REGEX.test(tokens[idx+1].content)) {
      return "";
    } else {
      return defaultParagraphOpenRenderer(tokens, idx, options, env, self);
    }

  };

  md.renderer.rules.text = function(tokens, idx, options, env, self) {

    if (REGEX.test(tokens[idx].content)) {
      return tokens[idx].content;
    } else {
      return defaultTextRenderer(tokens, idx, options, env, self);
    }
  };

  md.renderer.rules.paragraph_close = function(tokens, idx, options, env, self) {
    if (REGEX.test(tokens[idx-1].content)) {
      return "";
    } else {
      return defaultParagraphCloseRenderer(tokens, idx, options, env, self);
    }
  };
};
