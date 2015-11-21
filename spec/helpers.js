/*global jasmine, beforeEach*/

function isArray(a) {
  return a.constructor.name === 'Array' || a.constructor.name === 'Uint8Array';
}
  
function blockEquality(a, b) {
  if (!isArray(a) || !isArray(b))
    return undefined;
  if (a.length !== b.length)
    return false;
  for (var i = 0; i < a.length; i++) {
    if (a[i] !== b[i])
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

