const aes = require('..');

function makeCrypter(options) {
  switch (options.modeOfOperation) {
  case 'ecb':
    return new aes.ECB(options.key);
  case 'cfb':
    return new aes.CFB(options.key, options.iv, options.segmentSize);
  case 'ofb':
    return new aes.OFB(options.key, options.iv);
  case 'cbc':
    return new aes.CBC(options.key, options.iv);
  case 'ctr':
    return new aes.CTR(options.key, new aes.Counter(0));
  default:
    throw new Error('unknwon mode of operation');
  }
}

const testVectors = require('./fixtures/test-vectors.js');

describe('Examples', function() {
  testVectors.forEach(function(options) {
    it('test-' + options.modeOfOperation + '-' + options.key.length, function() {
      const encrypter = makeCrypter(options);
      const decrypter = makeCrypter(options);

      for (let i = 0; i < options.plaintext.length; i++) {
        const plaintext = options.plaintext[i].slice();
        const ciphertext = options.encrypted[i].slice();
        const encrypted = new Array(plaintext.length);
        const decrypted = new Array(ciphertext.length);

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
