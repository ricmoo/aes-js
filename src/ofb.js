"use strict";

var AES = require('./aes');
var copyIV = require('./iv');

/**
 *  Mode Of Operation - Output Feedback (OFB)
 */
var OFB = function(key, iv) {
  if (iv && iv.length !== 16)
    throw new Error('initialation vector iv must be of length 16');

  this.description = "Output Feedback";
  this.name = "ofb";
  this._lastPrecipher = copyIV(iv);
  this._lastPrecipherIndex = 16;

  this._aes = new AES(key);
};

OFB.prototype.encrypt = function(plaintext, result) {
  for (var i = 0; i < plaintext.length; i++) {
    if (this._lastPrecipherIndex === 16) {
      this._aes.encrypt(this._lastPrecipher, this._lastPrecipher);
      this._lastPrecipherIndex = 0;
    }
    result[i] = plaintext[i] ^ this._lastPrecipher[this._lastPrecipherIndex];
    this._lastPrecipherIndex++;
  }
};

// Decryption is symetric
OFB.prototype.decrypt = OFB.prototype.encrypt;

module.exports = OFB;

