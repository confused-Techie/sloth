module.exports = (md, options) => {
  const REGEX_ONE_LINE = /(<%%|<%=|<%-|<%_|<%#)([\S\s]+)(%>|-%>|_%>)/g;

  md.renderer.rules.ejs = function(tokens, idx, options, env, self) {
    return tokens[idx].content;
  };

  md.inline.ruler.after("text", "includeEJS", (state, silent) => {
    let marker = state.src.charAt(state.pos);
    let pos = state.pos;
    let content = "";

    if (marker !== "<") { return false; }

    if (!REGEX_ONE_LINE.test(state.src)) { return false; }

    // Now we know our source is a valid EJS templating method

    while(pos < state.posMax && state.src.charAt(pos) !== ">") {
      pos++;
    }
    // Since the above loop will cycle through all tokens until hitting the end
    // token, but doesn't include it, we need to add one more
    pos = pos + 1;

    if (pos === state.pos) { return false; } // is empty token

    if (!silent) { content += state.src.slice(state.pos, pos); }

    state.pos = pos;

    let token = state.push('ejs', '', 0);
    token.content = content;

    return true;
  });
};
