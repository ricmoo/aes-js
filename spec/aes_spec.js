var aes = require('../src/index');
var makeBlock = require('../src/buffer').makeBlock;
var blocks = require('./helpers').blocks;

function octetsToBlock(octets) {
  var block = makeBlock(octets.length);
  for (var i = 0; i < octets.length; ++i)
    block.setUint8(i, octets[i]);
  return block;
}

function makeCrypter(options) {
  var key = octetsToBlock(options.key);
  switch (options.modeOfOperation) {
  case 'ecb':
    return new aes.ModeOfOperation.ecb(key);
  case 'cfb':
    return new aes.ModeOfOperation.cfb(key, octetsToBlock(options.iv), options.segmentSize);
  case 'ofb':
    return new aes.ModeOfOperation.ofb(key, octetsToBlock(options.iv));
  case 'cbc':
    return new aes.ModeOfOperation.cbc(key, octetsToBlock(options.iv));
  case 'ctr':
    return new aes.ModeOfOperation.ctr(key, new aes.Counter(0));
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
        var plaintext = octetsToBlock(options.plaintext[i]);
        var ciphertext = octetsToBlock(options.encrypted[i]);

        expect(encrypter.encrypt(plaintext)).toEqual(ciphertext);
        expect(decrypter.decrypt(ciphertext)).toEqual(plaintext);
      }
    });
  });
});

