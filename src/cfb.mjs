import {AES} from './aes.mjs';
import {copyIV} from './iv';

/**
 *  Mode Of Operation - Cipher Feedback (CFB)
 */
export class CFB {
  constructor(key, iv, segmentSize) {
    if (iv && iv.length !== 16) {
      throw new Error('initialation vector iv must be of length 16');
    }

    this.description = "Cipher Feedback";
    this.name = "cfb";
    this.segmentSize = segmentSize || 1;
    this._shiftRegister = copyIV(iv);
    this._aes = new AES(key);
  }

  encrypt(plaintext, result) {
    if ((plaintext.length % this.segmentSize) !== 0) {
      throw new Error('plaintext must be a block of size module segmentSize (' + this.segmentSize + ')');
    }
    if ((result.length % this.segmentSize) !== 0) {
      throw new Error('result must be a block of size module segmentSize (' + this.segmentSize + ')');
    }

    const xorSegment = new Array(16);
    for (let i = 0; i < plaintext.length; i += this.segmentSize) {
      this._aes.encrypt(this._shiftRegister, xorSegment);
      for (let j = 0; j < this.segmentSize; j++) {
        result[i + j] = plaintext[i + j] ^ xorSegment[j];
      }

      // Shift the register
      this._shiftRegister.splice(0, this.segmentSize);
      for (let j = 0; j < this.segmentSize; ++j) {
        this._shiftRegister.push(result[i + j]);
      }
    }
  }

  decrypt(ciphertext, result) {
    if ((ciphertext.length % this.segmentSize) !== 0) {
      throw new Error('ciphertext must be a block of size module segmentSize (' + this.segmentSize + ')');
    }
    if ((result.length % this.segmentSize) !== 0) {
      throw new Error('result must be a block of size module segmentSize (' + this.segmentSize + ')');
    }

    const xorSegment = new Array(16);
    for (let i = 0; i < ciphertext.length; i += this.segmentSize) {
      this._aes.encrypt(this._shiftRegister, xorSegment);
      for (let j = 0; j < this.segmentSize; j++) {
        result[i + j] = ciphertext[i + j] ^ xorSegment[j];
      }

      // Shift the register
      this._shiftRegister.splice(0, this.segmentSize);
      for (let j = 0; j < this.segmentSize; ++j) {
        this._shiftRegister.push(ciphertext[i + j]);
      }
    }
  }
}
