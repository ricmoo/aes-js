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

describe('Counter', function() {
  describe('test-counter-number', function() {
    function makeTestNumber(options) {
      var result = createBuffer(options.incrementResult, 'hex');

      var counter = new aes.Counter(options.number);
      counter.increment();
      expect(bufferEquals(counter._counter, result)).toBeTruthy();

      counter.setValue(options.number);
      counter.increment();
      expect(bufferEquals(counter._counter, result)).toBeTruthy();

      counter = new aes.Counter();
      counter.setValue(options.number);
      counter.increment();
      expect(bufferEquals(counter._counter, result)).toBeTruthy();
    }

    it('test-0', function() { makeTestNumber({number: 0, incrementResult: "00000000000000000000000000000001"}); });
    it('test-1', function() { makeTestNumber({number: 1, incrementResult: "00000000000000000000000000000002"}); });
    it('test-254', function() { makeTestNumber({number: 254, incrementResult: "000000000000000000000000000000ff"}); });
    it('test-255', function() { makeTestNumber({number: 255, incrementResult: "00000000000000000000000000000100"}); });
    it('test-256', function() { makeTestNumber({number: 256, incrementResult: "00000000000000000000000000000101"}); });
  });

  describe('test-counter-bytes', function() {
    function makeTestBytes(options) {
      var result = createBuffer(options.incrementResult, 'hex');

      var bytes = createBuffer(options.bytes, 'hex');

      var counter = new aes.Counter(bytes);
      counter.increment();
      expect(bufferEquals(counter._counter, result)).toBeTruthy();

      counter.setBytes(bytes);
      counter.increment();
      expect(bufferEquals(counter._counter, result)).toBeTruthy();

      counter = new aes.Counter();
      counter.setBytes(bytes);
      counter.increment();
      expect(bufferEquals(counter._counter, result)).toBeTruthy();
    }

    it('test-0000', function() { makeTestBytes({bytes: "00000000000000000000000000000000", incrementResult: "00000000000000000000000000000001"}); });
    it('test-00ff', function() { makeTestBytes({bytes: "000000000000000000000000000000ff", incrementResult: "00000000000000000000000000000100"}); });
    it('test-ffff', function() { makeTestBytes({bytes: "ffffffffffffffffffffffffffffffff", incrementResult: "00000000000000000000000000000000"}); });
    it('test-dead', function() { makeTestBytes({bytes: "deadbeefdeadbeefdeadbeefdeadbeef", incrementResult: "deadbeefdeadbeefdeadbeefdeadbef0"}); });
  });
});

