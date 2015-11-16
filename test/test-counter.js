var nodeunit = require('nodeunit');

var aes = require('../index');

function bufferEquals(a, b) {
    if (a.length != b.length) { return false; }
    for (var i = 0; i < a.length; i++) {
        if (a[i] != b[i]) { return false; }
    }
    return true;
}

function makeTest (options) {
    return function(test) {
        var result = new Buffer(options.incrementResult, 'hex');

        if (options.hasOwnProperty('number')) {

            var counter = new aes.Counter(options.number);
            counter.increment();
            test.ok(bufferEquals(counter._counter, result), "counter failed to initialize with a number")

            counter.setValue(options.number);
            counter.increment();
            test.ok(bufferEquals(counter._counter, result), "counter failed to reset to a number")

            counter = new aes.Counter();
            counter.setValue(options.number);
            counter.increment();
            test.ok(bufferEquals(counter._counter, result), "counter failed to reset to a number")
        }

        if (options.bytes) {
            var bytes = new Buffer(options.bytes, 'hex');

            var counter = new aes.Counter(bytes);
            counter.increment();
            test.ok(bufferEquals(counter._counter, result), "counter failed to initialize with bytes")

            counter.setBytes(bytes);
            counter.increment();
            test.ok(bufferEquals(counter._counter, result), "counter failed to reset with bytes")

            counter = new aes.Counter();
            counter.setBytes(bytes);
            counter.increment();
            test.ok(bufferEquals(counter._counter, result), "counter failed to reset with bytes")
        }

        test.done();
    };
}

var Tests = {
    'test-counter-number': {
        'test-0': makeTest({number: 0, incrementResult: "00000000000000000000000000000001"}),
        'test-1': makeTest({number: 1, incrementResult: "00000000000000000000000000000002"}),
        'test-254': makeTest({number: 254, incrementResult: "000000000000000000000000000000ff"}),
        'test-255': makeTest({number: 255, incrementResult: "00000000000000000000000000000100"}),
        'test-256': makeTest({number: 256, incrementResult: "00000000000000000000000000000101"}),
    },
    'test-counter-bytes': {
        'test-0000': makeTest({bytes: "00000000000000000000000000000000", incrementResult: "00000000000000000000000000000001"}),
        'test-00ff': makeTest({bytes: "000000000000000000000000000000ff", incrementResult: "00000000000000000000000000000100"}),
        'test-ffff': makeTest({bytes: "ffffffffffffffffffffffffffffffff", incrementResult: "00000000000000000000000000000000"}),
        'test-dead': makeTest({bytes: "deadbeefdeadbeefdeadbeefdeadbeef", incrementResult: "deadbeefdeadbeefdeadbeefdeadbef0"}),
    },
};

/*
for (var i = 0; i < testVectors.length; i++) {
    var test = testVectors[i];
    name = 'test-' + test.modeOfOperation + '-' + test.key.length;
    if (!Tests[name]) { Tests[name] = {}; }
    Tests[name]['test-' + Object.keys(Tests[name]).length] = makeTest(test);
}
*/
nodeunit.reporters.default.run(Tests);

