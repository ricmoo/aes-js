var createBuffer = null, convertBytesToString, convertStringToBytes = null;

if (typeof Buffer === 'undefined') {
  createBuffer = function(arg) {

    // Passed in a single number, the length to pre-allocate
    if (typeof arg === 'number') {
      var result = [];
      for (var i = 0; i < arg; i++) {
        result.push(0);
      }
      return result;

    } else  {
      // Make sure they are passing sensible data
      for (var i = 0; i < arg.length; i++) {
        if (arg[i] < 0 || arg[i] >= 256 || typeof arg[i] !== 'number') {
          throw new Error('invalid byte at index ' + i + '(' + arg[i] + ')');
        }
      }
      return arg.slice(0);
    }
  }

  Array.prototype.copy = function(targetArray, targetStart, sourceStart, sourceEnd) {
    if (targetStart == null) { targetStart = 0; }
    if (sourceStart == null) { sourceStart = 0; }
    if (sourceEnd == null) { sourceEnd = this.length; }
    for (var i = sourceStart; i < sourceEnd; i++) {
      targetArray[targetStart++] = this[i];
    }
  }

  convertStringToBytes = function(text, encoding) {

    // "utf8", "utf-8", "utf 8", etc
    if (encoding == null || encoding.toLowerCase().replace(/ |-/g, "") == 'utf8') {
      var result = [], i = 0;
      text = encodeURI(text);
      while (i < text.length) {
        var c = text.charCodeAt(i++);

        // if it is a % sign, encode the following 2 bytes as a hex value
        if (c === 37) {
          result.push(parseInt(text.substr(i, 2), 16))
          i += 2;

          // otherwise, just the actual byte
        } else {
          result.push(c)
        }
      }

      return result;

      // "hex"
    } else if (encoding.toLowerCase() == 'hex') {
      var result = [];
      for (var i = 0; i < text.length; i += 2) {
        result.push(parseInt(text.substr(i, 2), 16));
      }

      return result;
    }

    // @TODO: Base64...

    return null;
  }

  // http://ixti.net/development/javascript/2011/11/11/base64-encodedecode-of-utf8-in-browser-with-js.html
  var Hex = '0123456789abcdef';
  convertBytesToString = function(bytes, encoding) {

    // "utf8", "utf-8", "utf 8", etc
    if (encoding == null || encoding.toLowerCase().replace(/ |-/g, "") == 'utf8') {
      var result = [], i = 0;

      while (i < bytes.length) {
        var c = bytes[i];

        if (c < 128) {
          result.push(String.fromCharCode(c));
          i++;
        } else if (c > 191 && c < 224) {
          result.push(String.fromCharCode(((c & 0x1f) << 6) | (bytes[i + 1] & 0x3f)));
          i += 2;
        } else {
          result.push(String.fromCharCode(((c & 0x0f) << 12) | ((bytes[i + 1] & 0x3f) << 6) | (bytes[i + 2] & 0x3f)));
          i += 3;
        }
      }

      return result.join('');

      // "hex"
    } else if (encoding.toLowerCase() == 'hex') {
      var result = [];
      for (var i = 0; i < bytes.length; i++) {
        var v = bytes[i];
        result.push(Hex[(v & 0xf0) >> 4] + Hex[v & 0x0f]);
      }
      return result.join('');
    }

    return result
  }

} else {
  createBuffer = function(arg) { return new Buffer(arg); }
  convertStringToBytes = function(text, encoding) {
    return new Buffer(text, encoding);
  }

  convertBytesToString = function(bytes, encoding) {
    return (new Buffer(bytes)).toString(encoding);
  }
}

module.exports = {
  createBuffer: createBuffer,
  convertBytesToString: convertBytesToString,
  convertStringToBytes: convertStringToBytes
};

