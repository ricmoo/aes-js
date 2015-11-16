function blockEquality(a, b) {
  if (a.constructor.name !== 'DataView' || b.constructor.name !== 'DataView')
    return undefined;
  if (a.byteLength !== b.byteLength)
    return false;
  for (var i = 0; i < a.byteLength; i++) {
    if (a.getUint8(i) !== b.getUint8(i))
      return false;
  }
  return true;
}

function blocks() {
  beforeEach(function() {
    jasmine.addCustomEqualityTester(blockEquality);
  });
}

module.exports = {
  blocks: blocks
};

