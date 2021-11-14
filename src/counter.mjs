/**
 *  Counter object for CTR common mode of operation
 */
export class Counter {
  constructor(initialValue = 1) {
    if (typeof(initialValue) === 'number') {
      this._counter = new Array(16);
      this.setValue(initialValue);
    } else {
      this.setBytes(initialValue);
    }
  }

  setValue(value) {
    if (typeof(value) !== 'number') {
      throw new Error('value must be a number');
    }

    for (let index = 15; index >= 0; --index) {
      this._counter[index] = value % 256;
      value = value >> 8;
    }
  }

  setBytes(bytes) {
    if (bytes.length !== 16) {
      throw new Error('invalid counter bytes size (must be 16)');
    }
    this._counter = bytes.slice();
  }

  increment() {
    for (let i = 15; i >= 0; i--) {
      const digit = this._counter[i];
      if (digit === 255) {
        this._counter[i] = 0;
      } else {
        this._counter[i] = digit + 1;
        break;
      }
    }
  }
}
