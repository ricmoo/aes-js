import {AES} from './aes.mjs';
import {copyIV} from './iv';

function xorBlocks(result, first, second) {
  for (var i = 0; i < result.length; i++) {
    result[i] = first[i] ^ second[i];
  }
}

/**
 *  Mode Of Operation - Cipher Block Chaining (CBC)
 */
export class CBC {
  constructor(key, iv) {
    if (iv && iv.length !== 16)
      throw new Error('initialation vector iv must be of length 16');

    this.description = "Cipher Block Chaining";
    this.name = "cbc";
    this._lastCipherblock = copyIV(iv);

    this._aes = new AES(key);
  }

  encrypt(plaintext, result) {
    if (plaintext.length !== 16) {
      throw new Error('plaintext must be a block of size 16');
    }
    if (result.length !== 16) {
      throw new Error('result must be a block of size 16');
    }

    xorBlocks(result, this._lastCipherblock, plaintext);
    this._aes.encrypt(result, result);
    this._lastCipherblock = result.slice();
  }

  decrypt(ciphertext, result) {
    if (ciphertext.length !== 16) {
      throw new Error('ciphertext must be a block of size 16');
    }
    if (result.length !== 16) {
      throw new Error('result must be a block of size 16');
    }

    this._aes.decrypt(ciphertext, result);
    xorBlocks(result, result, this._lastCipherblock);
    this._lastCipherblock = ciphertext.slice();
  }
}
