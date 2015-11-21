/*global describe, it, expect*/
var aes = require('../src/index');
var blocks = require('./helpers').blocks;

function makeCrypter(options) {
  var key = options.key;
  switch (options.modeOfOperation) {
  case 'ecb':
    return new aes.ECB(key);
  case 'cfb':
    return new aes.CFB(key, options.iv, options.segmentSize);
  case 'ofb':
    return new aes.OFB(key, options.iv);
  case 'cbc':
    return new aes.CBC(key, options.iv);
  case 'ctr':
    return new aes.CTR(key, new aes.Counter(0));
  default:
    throw new Error('unknwon mode of operation');
  }
}

var testVectors = require('./fixtures/test-vectors.js');

describe('Examples', function() {
  blocks();

  testVectors.forEach(function(options) {
    it('test-' + options.modeOfOperation + '-' + options.key.length, function() {
      var encrypter = makeCrypter(options);
      var decrypter = makeCrypter(options);

      for (var i = 0; i < options.plaintext.length; i++) {
        var plaintext = options.plaintext[i].slice();
        var ciphertext = options.encrypted[i].slice();
        var encrypted = new Array(plaintext.length);
        var decrypted = new Array(ciphertext.length);

        encrypter.encrypt(plaintext, encrypted);
        decrypter.decrypt(ciphertext, decrypted);

        expect(encrypted).toEqual(ciphertext);
        expect(decrypted).toEqual(plaintext);

        // input buffers are not modified
        expect(options.plaintext[i]).toEqual(plaintext);
        expect(options.encrypted[i]).toEqual(ciphertext);
      }
    });
  });
});

