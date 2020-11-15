'use strict';

var escapeChars = [
  0x24, /* $ */
  0x28, /* ( */
  0x29, /* ) */
  0x2a, /* * */
  0x2b, /* + */
  0x2d, /* - */
  0x2e, /* . */
  0x2f, /* / */
  0x3f, /* ? */
  0x5b, /* [ */
  0x5c, /* \ */
  0x5d, /* ] */
  0x5e, /* ^ */
  0x7b, /* { */
  0x7c, /* | */
  0x7d  /* } */
];

// Escape regex special characters
function isEscape(c) {
  var i;
  for (i = 0; i < escapeChars.length; i++) {
    if (c === escapeChars[i]) {
      return true;
    }
  }
  return false;
}

// Convert wildcard notation to RegExp object
//    ex.) test-*.png -> /test-([\s\S]+?)\.png/
//         test-??.png -> /test-(.)(.)\.png/
module.exports = function (wildcard) {
  var i, c;
  var regStr = '';
  for (i = 0; i < wildcard.length; i++) {
    c = wildcard.charCodeAt(i);
    if (c === 0x2a /* * */) {
      regStr += '([\\s\\S]+?)';
    } else if (c === 0x3f /* ? */) {
      regStr += '(.)';
    } else if (isEscape(c)) {
      regStr += '\\' + wildcard.charAt(i);
    } else {
      regStr += wildcard.charAt(i);
    }
  }
  return new RegExp(regStr);
};
