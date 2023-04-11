
function date() {
  return new Date().toDateString();
}

function timeToRead(content) {
  // This is a rather simplistic view at attempting to determine the average time
  // it will take someone to read a page.

  // First we will determine a word count.
  let wordCount = content.trim().split(/\s+/).length;
  let minutes = wordCount / 200; // The average adult reads 238 wpm, so lets go on the low end

  return Math.round(minutes);
}

module.exports = {
  date,
  timeToRead,
};
