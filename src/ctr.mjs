import {AES} from './aes.mjs';
import {Counter} from './counter';

/**
 *  Mode Of Operation - Counter (CTR)
 */
export class CTR {
  constructor(key, counter) {
    this.description = "Counter";
    this.name = "ctr";
    this._counter = counter || new Counter();
    this._remainingCounter = new Uint8Array(16);
    this._remainingCounterIndex = 16;
    this._aes = new AES(key);
  }

  encrypt(plaintext, result) {
    for (let i = 0; i < plaintext.length; i++) {
      if (this._remainingCounterIndex === 16) {
        this._aes.encrypt(this._counter._counter, this._remainingCounter);
        this._remainingCounterIndex = 0;
        this._counter.increment();
      }
      result[i] = plaintext[i] ^ this._remainingCounter[this._remainingCounterIndex];
      this._remainingCounterIndex++;
    }
  }

  // Decryption is symetric
  decrypt(plaintext, result) {
    return this.encrypt(plaintext, result);
  }
}
