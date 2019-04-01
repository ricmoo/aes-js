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

expect.extend({
  toBeSagaCall(received, argument) {
    if (blockEquality(received, argument)) {
      return {
        message: () => `expected ${this.utils.printExpected(received)} not to be equal to ${this.utils.printReceived(argument)}`,
        pass: true,
      };
    } else {
      return {
        message: () => `expected ${this.utils.printExpected(received)} to be equal to ${this.utils.printReceived(argument)}`,
        pass: false,
      };
    }
  },
});

module.exports = {};
