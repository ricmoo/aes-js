"use strict";

var AES = require('./aes');
var copyIV = require('./iv');

function xorBlocks(result, first, second) {
  for (var i = 0; i < result.length; i++) {
    result[i] = first[i] ^ second[i];
  }
}

    /**
     *  Mode Of Operation - Electonic Codebook (ECB)
     */
    var ModeOfOperationECB = function(key) {
        this.description = "Electronic Code Block";
        this.name = "ecb";

        this._aes = new AES(key);
    }

    ModeOfOperationECB.prototype.encrypt = function(plaintext, result) {
        this._aes.encrypt(plaintext, result);
    }

    ModeOfOperationECB.prototype.decrypt = function(ciphertext, result) {
        this._aes.decrypt(ciphertext, result);
    }


    /**
     *  Mode Of Operation - Cipher Block Chaining (CBC)
     */
    var ModeOfOperationCBC = function(key, iv) {
        if (iv && iv.length !== 16)
            throw new Error('initialation vector iv must be of length 16');

        this.description = "Cipher Block Chaining";
        this.name = "cbc";
        this._lastCipherblock = copyIV(iv);

        this._aes = new AES(key);
    }

    ModeOfOperationCBC.prototype.encrypt = function(plaintext, result) {
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

    ModeOfOperationCBC.prototype.decrypt = function(ciphertext, result) {
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


    /**
     *  Mode Of Operation - Cipher Feedback (CFB)
     */
    var ModeOfOperationCFB = function(key, iv, segmentSize) {
        if (iv && iv.length !== 16)
            throw new Error('initialation vector iv must be of length 16');

        this.description = "Cipher Feedback";
        this.name = "cfb";
        this.segmentSize = segmentSize || 1;
        this._shiftRegister = copyIV(iv);
        this._aes = new AES(key);
    }

    ModeOfOperationCFB.prototype.encrypt = function(plaintext, result) {
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
    }

    ModeOfOperationCFB.prototype.decrypt = function(ciphertext, result) {
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
    }

    /**
     *  Mode Of Operation - Output Feedback (OFB)
     */
    var ModeOfOperationOFB = function(key, iv) {
        if (iv && iv.length !== 16)
            throw new Error('initialation vector iv must be of length 16');

        this.description = "Output Feedback";
        this.name = "ofb";
        this._lastPrecipher = copyIV(iv);
        this._lastPrecipherIndex = 16;

        this._aes = new AES(key);
    }

    ModeOfOperationOFB.prototype.encrypt = function(plaintext, result) {
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
    ModeOfOperationOFB.prototype.decrypt = ModeOfOperationOFB.prototype.encrypt;


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
        ecb: ModeOfOperationECB,
        cbc: ModeOfOperationCBC,
        cfb: ModeOfOperationCFB,
        ofb: ModeOfOperationOFB,
        ctr: ModeOfOperationCTR
    };


module.exports = {
  AES: AES,
  Counter: Counter,
  ModeOfOperation: ModeOfOperation
};

