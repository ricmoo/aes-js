var aes = require('../src/index');
var bufferModule = require('../src/buffer');
var makeBlock = bufferModule.makeBlock;
var blocks = require('./helpers').blocks;

function hexToBlock(data) {
  var block = makeBlock(data.length / 2);
  for (var i = 0; i < data.length; i += 2) {
    block.setUint8(i / 2, parseInt(data.substring(i, i + 2), 16));
  }
  return block;
}

describe('Counter', function() {
  blocks();

  describe('test-counter-number', function() {
    function makeTestNumber(options) {
      var result = hexToBlock(options.incrementResult);

      var counter = new aes.Counter(options.number);
      counter.increment();
      expect(counter._counter).toEqual(result);

      counter.setValue(options.number);
      counter.increment();
      expect(counter._counter).toEqual(result);

      counter = new aes.Counter();
      counter.setValue(options.number);
      counter.increment();
      expect(counter._counter).toEqual(result);
    }

    it('test-0', function() { makeTestNumber({number: 0, incrementResult: "00000000000000000000000000000001"}); });
    it('test-1', function() { makeTestNumber({number: 1, incrementResult: "00000000000000000000000000000002"}); });
    it('test-254', function() { makeTestNumber({number: 254, incrementResult: "000000000000000000000000000000ff"}); });
    it('test-255', function() { makeTestNumber({number: 255, incrementResult: "00000000000000000000000000000100"}); });
    it('test-256', function() { makeTestNumber({number: 256, incrementResult: "00000000000000000000000000000101"}); });
  });

  describe('test-counter-bytes', function() {
    function makeTestBytes(options) {
      var result = hexToBlock(options.incrementResult);

      var bytes = hexToBlock(options.bytes);

      var counter = new aes.Counter(bytes);
      counter.increment();
      expect(counter._counter).toEqual(result);

      counter.setBytes(bytes);
      counter.increment();
      expect(counter._counter).toEqual(result);

      counter = new aes.Counter();
      counter.setBytes(bytes);
      counter.increment();
      expect(counter._counter).toEqual(result);
    }

    it('test-0000', function() { makeTestBytes({bytes: "00000000000000000000000000000000", incrementResult: "00000000000000000000000000000001"}); });
    it('test-00ff', function() { makeTestBytes({bytes: "000000000000000000000000000000ff", incrementResult: "00000000000000000000000000000100"}); });
    it('test-ffff', function() { makeTestBytes({bytes: "ffffffffffffffffffffffffffffffff", incrementResult: "00000000000000000000000000000000"}); });
    it('test-dead', function() { makeTestBytes({bytes: "deadbeefdeadbeefdeadbeefdeadbeef", incrementResult: "deadbeefdeadbeefdeadbeefdeadbef0"}); });
  });
});

