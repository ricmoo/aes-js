"use strict";

var bufferModule = require('./buffer');
var makeBlock = bufferModule.makeBlock;
var copyBlock = bufferModule.copyBlock;
var memMove = bufferModule.memMove;
var AES = require('./aes');

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
        if (iv && iv.byteLength !== 16)
            throw new Error('initialation vector iv must be of length 16');

        this.description = "Cipher Block Chaining";
        this.name = "cbc";
        this._lastCipherblock = iv ? copyBlock(iv) : makeBlock();

        this._aes = new AES(key);
    }

    ModeOfOperationCBC.prototype.encrypt = function(plaintext, result) {
        if (plaintext.byteLength !== 16) {
            throw new Error('plaintext must be a block of size 16');
        }
        if (result.byteLength !== 16) {
            throw new Error('result must be a block of size 16');
        }

        for (var i = 0; i < 16; i++) {
            this._lastCipherblock.setUint8(i, plaintext.getUint8(i) ^ this._lastCipherblock.getUint8(i));
        }

        this._aes.encrypt(this._lastCipherblock, this._lastCipherblock);

        memMove(this._lastCipherblock, 0, 16, result, 0);
    }

    ModeOfOperationCBC.prototype.decrypt = function(ciphertext, result) {
        if (ciphertext.byteLength !== 16) {
            throw new Error('ciphertext must be a block of size 16');
        }
        if (result.byteLength !== 16) {
            throw new Error('result must be a block of size 16');
        }

        this._aes.decrypt(ciphertext, result);
        for (var i = 0; i < 16; i++) {
            result.setUint8(i, result.getUint8(i) ^ this._lastCipherblock.getUint8(i));
        }

        this._lastCipherblock = copyBlock(ciphertext);
    }


    /**
     *  Mode Of Operation - Cipher Feedback (CFB)
     */
    var ModeOfOperationCFB = function(key, iv, segmentSize) {
        if (iv && iv.byteLength !== 16)
            throw new Error('initialation vector iv must be of length 16');

        this.description = "Cipher Feedback";
        this.name = "cfb";
        this.segmentSize = segmentSize || 1;
        this._shiftRegister = iv ? copyBlock(iv) : makeBlock();
        this._aes = new AES(key);
    }

    ModeOfOperationCFB.prototype.encrypt = function(plaintext, result) {
        if ((plaintext.byteLength % this.segmentSize) !== 0) {
            throw new Error('plaintext must be a block of size module segmentSize (' + this.segmentSize + ')');
        }
        if ((result.byteLength % this.segmentSize) !== 0) {
            throw new Error('result must be a block of size module segmentSize (' + this.segmentSize + ')');
        }

        var encrypted = copyBlock(plaintext);
        var xorSegment = makeBlock();

        for (var i = 0; i < encrypted.byteLength; i += this.segmentSize) {
            this._aes.encrypt(this._shiftRegister, xorSegment);
            for (var j = 0; j < this.segmentSize; j++) {
                encrypted.setUint8(i + j, encrypted.getUint8(i + j) ^ xorSegment.getUint8(j));
            }

            // Shift the register
            var sr = makeBlock();
            memMove(this._shiftRegister, this.segmentSize, 16 - this.segmentSize, sr, 0);
            memMove(encrypted, i, this.segmentSize, sr, 16 - this.segmentSize);
            this._shiftRegister = sr;
        }

        memMove(encrypted, 0, encrypted.byteLength, result, 0);
    }

    ModeOfOperationCFB.prototype.decrypt = function(ciphertext, result) {
        if ((ciphertext.byteLength % this.segmentSize) !== 0) {
            throw new Error('ciphertext must be a block of size module segmentSize (' + this.segmentSize + ')');
        }
        if ((result.byteLength % this.segmentSize) !== 0) {
            throw new Error('result must be a block of size module segmentSize (' + this.segmentSize + ')');
        }

        var plaintext = copyBlock(ciphertext);

        var xorSegment = makeBlock();
        for (var i = 0; i < plaintext.byteLength; i += this.segmentSize) {
            this._aes.encrypt(this._shiftRegister, xorSegment);

            for (var j = 0; j < this.segmentSize; j++) {
                plaintext.setUint8(i + j, plaintext.getUint8(i + j) ^ xorSegment.getUint8(j));
            }

            // Shift the register
            var sr = makeBlock();
            memMove(this._shiftRegister, this.segmentSize, 16 - this.segmentSize, sr, 0);
            memMove(ciphertext, i, this.segmentSize, sr, 16 - this.segmentSize);
            this._shiftRegister = sr;
        }

        memMove(plaintext, 0, plaintext.byteLength, result, 0);
    }

    /**
     *  Mode Of Operation - Output Feedback (OFB)
     */
    var ModeOfOperationOFB = function(key, iv) {
        if (iv && iv.byteLength !== 16)
            throw new Error('initialation vector iv must be of length 16');

        this.description = "Output Feedback";
        this.name = "ofb";
        this._lastPrecipher = iv ? copyBlock(iv) : makeBlock();
        this._lastPrecipherIndex = 16;

        this._aes = new AES(key);
    }

    ModeOfOperationOFB.prototype.encrypt = function(plaintext, result) {
        var encrypted = copyBlock(plaintext);

        for (var i = 0; i < encrypted.byteLength; i++) {
            if (this._lastPrecipherIndex === 16) {
                this._aes.encrypt(this._lastPrecipher, this._lastPrecipher);
                this._lastPrecipherIndex = 0;
            }
            encrypted.setUint8(i, encrypted.getUint8(i) ^ this._lastPrecipher.getUint8(this._lastPrecipherIndex++));
        }

        memMove(encrypted, 0, encrypted.byteLength, result, 0);
    }

    // Decryption is symetric
    ModeOfOperationOFB.prototype.decrypt = ModeOfOperationOFB.prototype.encrypt;


    /**
     *  Counter object for CTR common mode of operation
     */
    var Counter = function(initialValue) {
        if (initialValue === null || initialValue === undefined) { initialValue = 1; }

        if (typeof(initialValue) === 'number') {
            this._counter = makeBlock();
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
            this._counter.setUint8(index, value % 256);
            value = value >> 8;
        }
    }

    Counter.prototype.setBytes = function(bytes) {
        if (bytes.byteLength !== 16) {
            throw new Error('invalid counter bytes size (must be 16)');
        }
        this._counter = copyBlock(bytes);
    };

    Counter.prototype.increment = function() {
        for (var i = 15; i >= 0; i--) {
            var digit = this._counter.getUint8(i);
            if (digit === 255) {
                this._counter.setUint8(i, 0);
            } else {
                this._counter.setUint8(i, digit + 1);
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
        this._remainingCounter = makeBlock();
        this._remainingCounterIndex = 16;
        this._aes = new AES(key);
    }

    ModeOfOperationCTR.prototype.encrypt = function(plaintext, result) {
        var encrypted = copyBlock(plaintext);

        for (var i = 0; i < encrypted.byteLength; i++) {
            if (this._remainingCounterIndex === 16) {
                this._aes.encrypt(this._counter._counter, this._remainingCounter);
                this._remainingCounterIndex = 0;
                this._counter.increment();
            }
            encrypted.setUint8(i, encrypted.getUint8(i) ^ this._remainingCounter.getUint8(this._remainingCounterIndex++));
        }

        memMove(encrypted, 0, encrypted.byteLength, result, 0);
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

