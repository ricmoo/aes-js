import {AES} from './aes.mjs';

/**
 *  Mode Of Operation - Electonic Codebook (ECB)
 */
export class ECB {
  constructor(key) {
    this.description = "Electronic Code Block";
    this.name = "ecb";
    this._aes = new AES(key);
  }

  encrypt(plaintext, result) {
    this._aes.encrypt(plaintext, result);
  }

  decrypt(ciphertext, result) {
    this._aes.decrypt(ciphertext, result);
  }
}
