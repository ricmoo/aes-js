"use strict";

var AES = require('./aes');

var ecb = require('./ecb');
var cbc = require('./cbc');
var cfb = require('./cfb');
var ofb = require('./ofb');


    /**
     *  Counter object for CTR common mode of operation
     */
    var Counter = function(initialValue) {
        if (initialValue === null || initialValue === undefined) { initialValue = 1; }

        if (typeof(initialValue) === 'number') {
            this._counter = new Array(16);
            this.setValue(initialValue);
        } else {
            this.setBytes(initialValue);
        }
    }

    Counter.prototype.setValue = function(value) {
        if (typeof(value) !== 'number') {
            throw new Error('value must be a number');
        }

        for (var index = 15; index >= 0; --index) {
            this._counter[index] = value % 256;
            value = value >> 8;
        }
    }

    Counter.prototype.setBytes = function(bytes) {
        if (bytes.length !== 16) {
            throw new Error('invalid counter bytes size (must be 16)');
        }
        this._counter = bytes.slice();
    };

    Counter.prototype.increment = function() {
        for (var i = 15; i >= 0; i--) {
            var digit = this._counter[i];
            if (digit === 255) {
                this._counter[i] = 0;
            } else {
                this._counter[i] = digit + 1;
                break;
            }
        }
    }


    /**
     *  Mode Of Operation - Counter (CTR)
     */
    var ModeOfOperationCTR = function(key, counter) {
        this.description = "Counter";
        this.name = "ctr";
        this._counter = counter || new Counter();
        this._remainingCounter = new Uint8Array(16);
        this._remainingCounterIndex = 16;
        this._aes = new AES(key);
    }

    ModeOfOperationCTR.prototype.encrypt = function(plaintext, result) {
        for (var i = 0; i < plaintext.length; i++) {
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
    ModeOfOperationCTR.prototype.decrypt = ModeOfOperationCTR.prototype.encrypt;


    // The bsic modes of operation as a map
    var ModeOfOperation = {
        ecb: ecb,
        cbc: cbc,
        cfb: cfb,
        ofb: ofb,
        ctr: ModeOfOperationCTR
    };


module.exports = {
  AES: AES,
  Counter: Counter,
  ModeOfOperation: ModeOfOperation
};

