"use strict";

var AES = require('./aes');
var Counter = require('./counter');

/**
 *  Mode Of Operation - Counter (CTR)
 */
var CTR = function(key, counter) {
  this.description = "Counter";
  this.name = "ctr";
  this._counter = counter || new Counter();
  this._remainingCounter = new Uint8Array(16);
  this._remainingCounterIndex = 16;
  this._aes = new AES(key);
};

CTR.prototype.encrypt = function(plaintext, result) {
  for (var i = 0; i < plaintext.length; i++) {
    if (this._remainingCounterIndex === 16) {
      this._aes.encrypt(this._counter._counter, this._remainingCounter);
      this._remainingCounterIndex = 0;
      this._counter.increment();
    }
    result[i] = plaintext[i] ^ this._remainingCounter[this._remainingCounterIndex];
    this._remainingCounterIndex++;
  }
};

// Decryption is symetric
CTR.prototype.decrypt = CTR.prototype.encrypt;

module.exports = CTR;

