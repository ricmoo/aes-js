import {AES} from './aes.mjs';
import {copyIV} from './iv';

/**
 *  Mode Of Operation - Output Feedback (OFB)
 */
export class OFB {
  constructor(key, iv) {
    if (iv && iv.length !== 16)
      throw new Error('initialation vector iv must be of length 16');

    this.description = "Output Feedback";
    this.name = "ofb";
    this._lastPrecipher = copyIV(iv);
    this._lastPrecipherIndex = 16;

    this._aes = new AES(key);
  }

  encrypt(plaintext, result) {
    for (var i = 0; i < plaintext.length; i++) {
      if (this._lastPrecipherIndex === 16) {
        this._aes.encrypt(this._lastPrecipher, this._lastPrecipher);
        this._lastPrecipherIndex = 0;
      }
      result[i] = plaintext[i] ^ this._lastPrecipher[this._lastPrecipherIndex];
      this._lastPrecipherIndex++;
    }
  }

  // Decryption is symetric
  decrypt(plaintext, result) {
    return this.encrypt(plaintext, result);
  }
}
