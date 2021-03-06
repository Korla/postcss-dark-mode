// (?=*something*) is a look ahead to match empty strings

module.exports = {
  shortHexa: /#([A-Fa-f0-9]{3})(?=($|\s))/gi,
  longHexa: /#([A-Fa-f0-9]{6})(?=($|\s))/gi,
  longestHexa: /#([A-Fa-f0-9]{8})(?=($|\s))/gi,
  rgb: /rgb\((\d+),(\d+),(\d+)\)(?=($|\s))/gi,
  rgba: /rgba\((\d+),(\d+),(\d+),(1|0?\.\d+)\)(?=($|\s))/gi,
  hsl: /hsl\((\d+),(\d*(?:\.\d+)?%),(\d*(?:\.\d+)?%)\)(?=($|\s))/gi,
  hsla: /hsla\((\d+),(\d*(?:\.\d+)?%),(\d*(?:\.\d+)?%),(1|0?\.\d+)\)(?=($|\s))/gi
};
