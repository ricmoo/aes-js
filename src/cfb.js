"use strict";

var AES = require('./aes');
var copyIV = require('./iv');

/**
 *  Mode Of Operation - Cipher Feedback (CFB)
 */
var CFB = function(key, iv, segmentSize) {
  if (iv && iv.length !== 16)
    throw new Error('initialation vector iv must be of length 16');

  this.description = "Cipher Feedback";
  this.name = "cfb";
  this.segmentSize = segmentSize || 1;
  this._shiftRegister = copyIV(iv);
  this._aes = new AES(key);
};

CFB.prototype.encrypt = function(plaintext, result) {
  if ((plaintext.length % this.segmentSize) !== 0) {
    throw new Error('plaintext must be a block of size module segmentSize (' + this.segmentSize + ')');
  }
  if ((result.length % this.segmentSize) !== 0) {
    throw new Error('result must be a block of size module segmentSize (' + this.segmentSize + ')');
  }

  var xorSegment = new Array(16);
  var j;
  for (var i = 0; i < plaintext.length; i += this.segmentSize) {
    this._aes.encrypt(this._shiftRegister, xorSegment);
    for (j = 0; j < this.segmentSize; j++) {
      result[i + j] = plaintext[i + j] ^ xorSegment[j];
    }

    // Shift the register
    this._shiftRegister.splice(0, this.segmentSize);
    for (j = 0; j < this.segmentSize; ++j)
      this._shiftRegister.push(result[i + j]);
  }
};

CFB.prototype.decrypt = function(ciphertext, result) {
  if ((ciphertext.length % this.segmentSize) !== 0) {
    throw new Error('ciphertext must be a block of size module segmentSize (' + this.segmentSize + ')');
  }
  if ((result.length % this.segmentSize) !== 0) {
    throw new Error('result must be a block of size module segmentSize (' + this.segmentSize + ')');
  }

  var xorSegment = new Array(16);
  var j;
  for (var i = 0; i < ciphertext.length; i += this.segmentSize) {
    this._aes.encrypt(this._shiftRegister, xorSegment);
    for (j = 0; j < this.segmentSize; j++) {
      result[i + j] = ciphertext[i + j] ^ xorSegment[j];
    }

    // Shift the register
    this._shiftRegister.splice(0, this.segmentSize);
    for (j = 0; j < this.segmentSize; ++j)
      this._shiftRegister.push(ciphertext[i + j]);
  }
};

module.exports = CFB;

