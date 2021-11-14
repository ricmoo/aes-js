const {Counter} = require('..');

function hex(data) {
  const block = new Array(data.length / 2);
  for (let i = 0; i < data.length; i += 2) {
    block[i / 2] = parseInt(data.substring(i, i + 2), 16);
  }
  return block;
}

describe('Counter', () => {
  it.each([
    [0,   hex('00000000000000000000000000000001')],
    [1,   hex('00000000000000000000000000000002')],
    [254, hex('000000000000000000000000000000ff')],
    [255, hex('00000000000000000000000000000100')],
    [256, hex('00000000000000000000000000000101')],
  ])('test-counter-number %#', (number, result) => {
    let counter = new Counter(number);
    counter.increment();
    expect(counter._counter).toEqual(result);

    counter.setValue(number);
    counter.increment();
    expect(counter._counter).toEqual(result);

    counter = new Counter();
    counter.setValue(number);
    counter.increment();
    expect(counter._counter).toEqual(result);
  });

  it.each([
    [hex('00000000000000000000000000000000'), hex('00000000000000000000000000000001')],
    [hex('000000000000000000000000000000ff'), hex('00000000000000000000000000000100')],
    [hex('ffffffffffffffffffffffffffffffff'), hex('00000000000000000000000000000000')],
    [hex('deadbeefdeadbeefdeadbeefdeadbeef'), hex('deadbeefdeadbeefdeadbeefdeadbef0')],
  ])('test-counter-bytes %#', (bytes, result) => {
    let counter = new Counter(bytes);
    counter.increment();
    expect(counter._counter).toEqual(result);

    counter.setBytes(bytes);
    counter.increment();
    expect(counter._counter).toEqual(result);

    counter = new Counter();
    counter.setBytes(bytes);
    counter.increment();
    expect(counter._counter).toEqual(result);
  });
});
