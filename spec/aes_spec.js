var aes = require('../src/index');

function createBuffer(data, hex) {
  if (typeof Buffer === 'undefined') {
    var i, buffer = [];
    if (data) {
      if (hex) {
	for (i = 0; i < data.length; i += 2) {
	  buffer.push(parseInt(data.substring(i, i + 2), 16));
	}
      } else {
	for (i = 0; i < data.length; ++i) {
	  buffer.push(data[i]);
	}
      }
    }
    return buffer;
  } else {
    return new Buffer(data, hex);
  }
}

function bufferEquals(a, b) {
    if (a.length != b.length) { return false; }
    for (var i = 0; i < a.length; i++) {
        if (a[i] != b[i]) { return false; }
    }
    return true;
}

function makeTest(options) {

    var modeOfOperation = options.modeOfOperation;
    var mo = aes.ModeOfOperation[modeOfOperation];

    var plaintext = [];
    for (var i = 0; i < options.plaintext.length; i++) {
        plaintext.push(createBuffer(options.plaintext[i]));
    }

    var key = createBuffer(options.key);

    var iv = null;
    if (options.iv) { iv = createBuffer(options.iv); }

    var segmentSize = 0;
    if (options.segmentSize) { segmentSize = options.segmentSize; }

    var ciphertext = [];
    for (var i = 0; i < options.encrypted.length; i++) {
        ciphertext.push(createBuffer(options.encrypted[i]));
    }


    return function (test) {
        var func;
        switch (modeOfOperation) {
            case 'ecb':
                func = function() { return new mo(key); }
                break;
            case 'cfb':
                func = function() { return new mo(key, iv, segmentSize); }
                break;
            case 'ofb':
            case 'cbc':
                func = function() { return new mo(key, iv); }
                break;
            case 'ctr':
                func = function() { return new mo(key, new aes.Counter(0)); }
                break;
            default:
                throw new Error('unknwon mode of operation')
        }

        var encrypter = func(), decrypter = func();
        var totalDiffers = 0;
        for (var i = 0; i < plaintext.length; i++) {
            var ciphertext2 = encrypter.encrypt(plaintext[i]);
	    expect(bufferEquals(ciphertext2, ciphertext[i])).toBeTruthy();

            var plaintext2 = decrypter.decrypt(ciphertext2);
            expect(bufferEquals(plaintext2, plaintext[i])).toBeTruthy();
        }
    };
};


var testVectors = require('./fixtures/test-vectors.js');

describe('Examples', function() {
  for (var i = 0; i < testVectors.length; i++) {
    var test = testVectors[i];
    var name = 'test-' + test.modeOfOperation + '-' + test.key.length;
    it(name, function() {
      makeTest(test)();
    });
  }
});

