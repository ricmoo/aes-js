"use strict";

var AES = require('./aes');

/**
 *  Mode Of Operation - Electonic Codebook (ECB)
 */
var ECB = function(key) {
  this.description = "Electronic Code Block";
  this.name = "ecb";
  this._aes = new AES(key);
};

ECB.prototype.encrypt = function(plaintext, result) {
  this._aes.encrypt(plaintext, result);
};

ECB.prototype.decrypt = function(ciphertext, result) {
  this._aes.decrypt(ciphertext, result);
};

module.exports = ECB;

