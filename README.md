AES-JS
======

[![npm version](https://badge.fury.io/js/aes-js.svg)](https://badge.fury.io/js/aes-js)

A pure JavaScript implementation of the AES block cipher algorithm and all common modes of operation (CBC, CFB, CTR, ECB and OFB).

Features
--------

- Pure JavaScript (with no dependencies)
- Supports all key sizes (128-bit, 192-bit and 256-bit)
- Supports all common modes of operation (CBC, CFB, CTR, ECB and OFB)
- Works in either node.js or web browsers


API
===

#### Node.js

To install `aes-js` in your node.js project:

```
npm install aes-js
```

And to access it from within node, simply add:

```javascript
var aesjs = require('aes-js');
```

#### Web Browser

To use `aes-js` in a web page, add the following:

```html
<script type="text/javascript" src="https://raw.githubusercontent.com/ricmoo/aes-js/master/index.js"></script>
```

Keys
----

All keys must be 128 bits (16 bytes), 192 bits (24 bytes) or 256 bits (32 bytes) long. The API's work on either arrays or `Buffer` objects.

```javascript
// 128-bit, 192-bit and 256-bit keys
var key_128 = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
var key_192 = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15,
               16, 17, 18, 19, 20, 21, 22, 23];
var key_256 = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15,
               16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28,
               29, 30, 31];

// or, similarly, with buffers (node.js only):
var key_128 = new Buffer([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]);
var key_192 = new Buffer([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15,
               16, 17, 18, 19, 20, 21, 22, 23]);
var key_256 = new Buffer([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15,
               16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28,
               29, 30, 31]);

```


To generate keys from simple-to-remember passwords, consider using a password-based key-derivation function such as [scrypt](https://www.npmjs.com/search?q=scrypt) or [bcrypt](https://www.npmjs.com/search?q=bcrypt).


Common Modes of Operation
-------------------------

There are several modes of operations, each with various pros and cons. In general though, the **CBC** and **CTR** modes are recommended. The **ECB is NOT recommended.**, and is included primarily for completeness.

### CTR - Counter (recommended)

```javascript
var key = aesjs.util.convertStringToBytes("Example128BitKey");

// Convert text to bytes
var text = 'Text may be any length you wish, no padding is required.';
var textBytes = aesjs.util.convertStringToBytes(text);

// The counter is optional, and if omitted will begin at 0
var aesCtr = new aesjs.ModeOfOperation.ctr(key, new aesjs.Counter(5));
var encryptedBytes = aesCtr.encrypt(textBytes);

// The counter mode of operation maintains internal state, so to
// decrypt a new instance must be instantiated.
var aesCtr = new aesjs.ModeOfOperation.ctr(key, new aesjs.Counter(5));
var decryptedBytes = aesCtr.decrypt(encryptedBytes);

// Convert our bytes back into text
var decryptedText = aesjs.util.convertBytesToString(decryptedBytes);
console.log(decryptedText);
// "Text may be any length you wish, no padding is required."
```


### CBC - Cipher-Block Chaining (recommended)

```javascript
var key = aesjs.util.convertStringToBytes("Example128BitKey");

// The initialization vector, which must be 16 bytes
var iv = aesjs.util.convertStringToBytes("IVMustBe16Bytes.");

// Convert text to bytes
var text = 'TextMustBe16Byte';
var textBytes = aesjs.util.convertStringToBytes(text);

var aesCbc = new aesjs.ModeOfOperation.cbc(key, iv);
var encryptedBytes = aesCbc.encrypt(textBytes);

// The cipher-block chaining mode of operation maintains internal
// state, so to decrypt a new instance must be instantiated.
var aesCbc = new aesjs.ModeOfOperation.cbc(key, iv);
var decryptedBytes = aesCbc.decrypt(encryptedBytes);

// Convert our bytes back into text
var decryptedText = aesjs.util.convertBytesToString(decryptedBytes);
console.log(decryptedText);
// "TextMustBe16Byte"
```


### CFB - Cipher Feedback 

```javascript
var key = aesjs.util.convertStringToBytes("Example128BitKey");

// The initialization vector, which must be 16 bytes
var iv = aesjs.util.convertStringToBytes("IVMustBe16Bytes.");

// Convert text to bytes
var text = 'TextMustBeAMultipleOfSegmentSize';
var textBytes = aesjs.util.convertStringToBytes(text);

// The segment size is optional, and defaults to 1
var aesCfb = new aesjs.ModeOfOperation.cfb(key, iv, 8);
var encryptedBytes = aesCfb.encrypt(textBytes);

// The cipher feedback mode of operation maintains internal state,
// so to decrypt a new instance must be instantiated.
var aesCfb = new aesjs.ModeOfOperation.cfb(key, iv, 8);
var decryptedBytes = aesCfb.decrypt(encryptedBytes);

// Convert our bytes back into text
var decryptedText = aesjs.util.convertBytesToString(decryptedBytes);
console.log(decryptedText);
// "TextMustBeAMultipleOfSegmentSize"
```


### OFB - Output Feedback

```javascript
var key = aesjs.util.convertStringToBytes("Example128BitKey");

// The initialization vector, which must be 16 bytes
var iv = aesjs.util.convertStringToBytes("IVMustBe16Bytes.");

// Convert text to bytes
var text = 'Text may be any length you wish, no padding is required.';
var textBytes = aesjs.util.convertStringToBytes(text);

var aesOfb = new aesjs.ModeOfOperation.ofb(key, iv);
var encryptedBytes = aesOfb.encrypt(textBytes);

// The output feedback mode of operation maintains internal state,
// so to decrypt a new instance must be instantiated.
var aesOfb = new aesjs.ModeOfOperation.ofb(key, iv);
var decryptedBytes = aesOfb.decrypt(encryptedBytes);

// Convert our bytes back into text
var decryptedText = aesjs.util.convertBytesToString(decryptedBytes);
console.log(decryptedText);
// "Text may be any length you wish, no padding is required."
```


### ECB - Electronic Codebook (NOT recommended)

This mode is **not** recommended. Since, for a given key, the same plaintext block in produces the same ciphertext block out, this mode of operation can leak data, such as patterns. For more details and examples, see the Wikipedia article, [Electronic Codebook](http://en.wikipedia.org/wiki/Block_cipher_mode_of_operation#Electronic_Codebook_.28ECB.29).

```javascript
var key = aesjs.util.convertStringToBytes("Example128BitKey");

// Convert text to bytes
var text = 'TextMustBe16Byte';
var textBytes = aesjs.util.convertStringToBytes(text);

var aesEcb = new aesjs.ModeOfOperation.ecb(key);
var encryptedBytes = aesEcb.encrypt(textBytes);

// Since electronic codebook does not store state, we can
// reuse the same instance.
//var aesEcb = new aesjs.ModeOfOperation.ecb(key);
var decryptedBytes = aesEcb.decrypt(encryptedBytes);

// Convert our bytes back into text
var decryptedText = aesjs.util.convertBytesToString(decryptedBytes);
console.log(decryptedText);
// "TextMustBe16Byte"
```



Block Cipher
------------

You should usually use one of the above common modes of operation. Using the block cipher algorithm directly is also possible using **ECB** as that mode of operation is merely a thin wrapper.

But this might be useful to experiment with custom modes of operation or play with block cipher algorithms.

```javascript

// the AES block cipher algorithm works on 16 byte bloca ks, no more, no less
var text = "ABlockIs16Bytes!";
var textAsBytes = aesjs.util.convertStringToBytes(text)
console.log(textAsBytes);
// [65, 66, 108, 111, 99, 107, 73, 115, 49, 54, 66, 121, 116, 101, 115, 33]


// create an instance of the block cipher algorithm
var key = [3, 1, 4, 1, 5, 9, 2, 6, 5, 3, 5, 8, 9, 7, 9, 3];
var aes = new aesjs.AES(key);


// encrypt...
var encryptedBytes = aes.encrypt(textAsBytes);
console.log(encryptedBytes);
// [136, 15, 199, 174, 118, 133, 233, 177, 143, 47, 42, 211, 96, 55, 107, 109] 


// decrypt...
var decryptedBytes = aes.decrypt(encryptedBytes);
console.log(decryptedBytes);
// [65, 66, 108, 111, 99, 107, 73, 115, 49, 54, 66, 121, 116, 101, 115, 33]


// decode the bytes back into our original text
var decryptedText = aesjs.util.convertBytesToString(decryptedBytes);
console.log(decryptedText);
// "ABlockIs16Bytes!"
```


Notes
=====

What is a Key
-------------

This seems to be a point of confusion for many people new to using encryption. You can think of the key as the *"password"*. However, these algorithms require the *"password"* to be a specific length.

With AES, there are three possible key lengths, 128-bit (16 bytes), 192-bit (24 bytes) or 256-bit (32 bytes). When you create an AES object, the key size is automatically detected, so it is important to pass in a key of the correct length.

Often, you wish to provide a password of arbitrary length, for example, something easy to remember or write down. In these cases, you must come up with a way to transform the password into a key of a specific length. A **Password-Based Key Derivation Function** (PBKDF) is an algorithm designed for this exact purpose.

Here is an example, using the popular (possibly obsolete?) pbkdf2:

```javascript
var pbkdf2 = require('pbkdf2');

var key_128 = pbkdf2.pbkdf2Sync('password', 'salt', 1, 128 / 8, 'sha512');
var key_192 = pbkdf2.pbkdf2Sync('password', 'salt', 1, 192 / 8, 'sha512');
var key_256 = pbkdf2.pbkdf2Sync('password', 'salt', 1, 256 / 8, 'sha512');
```

Another possibility, is to use a hashing function, such as SHA256 to hash the password, but this method is vulnerable to [Rainbow Attacks](http://en.wikipedia.org/wiki/Rainbow_table), unless you use a [salt](http://en.wikipedia.org/wiki/Salt_(cryptography)).

Performance
-----------

Todo...

Tests
-----

A test suite has been generated (`test/test-vectors.json`) from a known correct implementation, [pycrypto](https://www.dlitz.net/software/pycrypto/). To generate new test vectors, run `python generate-tests.py`.

To run the node.js test suite:

```
npm test
```

To run the web browser tests, open the `test/test.html` file in your browser.

FAQ
---

#### How do I get a question I have added?

E-mail me at aes-js@ricmoo.com with any questions, suggestions, comments, et cetera.


Donations
---------

Obviously, it's all licensed under the MIT license, so use it as you wish; but if you'd like to buy me a coffee, I won't complain. =)

- Bitcoin - `1K1Ax9t6uJmjE4X5xcoVuyVTsiLrYRqe2P`
- Dogecoin - `DFhgqVuaboxFnGQssyX84ZuV5r6aBRz8QJ`
- Testnet3 - `n1F2Eb6cknqqknUPp7m9oBNMgXFuaDowvF`
