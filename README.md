AES-ES
======

A pure JavaScript implementation of the AES block cipher algorithm and all common modes of operation (CBC, CFB, CTR, ECB and OFB).


Features
--------

- Pure JavaScript (with no dependencies)
- Supports all key sizes (128-bit, 192-bit and 256-bit)
- Supports all common modes of operation (CBC, CFB, CTR, ECB and OFB)
- Works in either node.js or web browsers


API
===

To install `aes-es` in your node.js project:

```
npm install aes-es
```

And to access it from within node, simply add:

```javascript
var aesjs = require('aes-es');
```

Following examples use [utf8-encoding](https://www.npmjs.com/package/utf8-encoding) to encode text to octets and decode back.
```javascript
var utf8 = require('utf8-encoding');
var encoder = new utf8.TextEncoder();
var decoder = new utf8.TextDecoder();
```

Data format
-----------

All API parameters considered as octet sequences. Any array-like object containing octets (e. g. Array, Uint8Array, Buffer) can be passed.


Keys
----

All keys must be 128 bits (16 bytes), 192 bits (24 bytes) or 256 bits (32 bytes) long.

```javascript
// 128-bit, 192-bit and 256-bit keys
var key_128 = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
var key_192 = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15,
               16, 17, 18, 19, 20, 21, 22, 23];
var key_256 = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15,
               16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28,
               29, 30, 31];
```


To generate keys from simple-to-remember passwords, consider using a password-based key-derivation function such as [scrypt](https://www.npmjs.com/search?q=scrypt) or [bcrypt](https://www.npmjs.com/search?q=bcrypt).


Common Modes of Operation
-------------------------

There are several modes of operations, each with various pros and cons. In general though, the **CBC** and **CTR** modes are recommended. The **ECB is NOT recommended.**, and is included primarily for completeness.

### CTR - Counter (recommended)

```javascript
var key = encoder.encode("Example128BitKey");

// Convert text to bytes
var text = 'Text may be any length you wish, no padding is required.';
var textBytes = encoder.encode(text);
var encryptedBytes = new Uint8Array(textBytes.length);

// The counter is optional, and if omitted will begin at 0
var aesCtr = new aesjs.CTR(key, new aesjs.Counter(5));
aesCtr.encrypt(textBytes, encryptedBytes);

// The counter mode of operation maintains internal state, so to
// decrypt a new instance must be instantiated.
var aesCtr = new aesjs.CTR(key, new aesjs.Counter(5));
var decryptedBytes = new Uint8Array(encryptedBytes.length);
aesCtr.decrypt(encryptedBytes, decryptedBytes);

// Convert our bytes back into text
var decryptedText = decoder.decode(decryptedBytes);
console.log(decryptedText);
// "Text may be any length you wish, no padding is required."
```


### CBC - Cipher-Block Chaining (recommended)

```javascript
var key = encoder.encode("Example128BitKey");

// The initialization vector, which must be 16 bytes
var iv = encoder.encode("IVMustBe16Bytes.");

// Convert text to bytes
var text = 'TextMustBe16Byte';
var textBytes = encoder.encode(text);

var aesCbc = new aesjs.CBC(key, iv);
var encryptedBytes = new Uint8Array(textBytes.length);
aesCbc.encrypt(textBytes, encryptedBytes);

// The cipher-block chaining mode of operation maintains internal
// state, so to decrypt a new instance must be instantiated.
var aesCbc = new aesjs.CBC(key, iv);
var decryptedBytes = new Uint8Array(encryptedBytes.length);
aesCbc.decrypt(encryptedBytes, decryptedBytes);

// Convert our bytes back into text
var decryptedText = decoder.decode(decryptedBytes);
console.log(decryptedText);
// "TextMustBe16Byte"
```


### CFB - Cipher Feedback 

```javascript
var key = encoder.encode("Example128BitKey");

// The initialization vector, which must be 16 bytes
var iv = encoder.encode("IVMustBe16Bytes.");

// Convert text to bytes
var text = 'TextMustBeAMultipleOfSegmentSize';
var textBytes = encoder.encode(text);

// The segment size is optional, and defaults to 1
var aesCfb = new aesjs.CFB(key, iv, 8);
var encryptedBytes = new Uint8Array(textBytes.length);
aesCfb.encrypt(textBytes, encryptedBytes);

// The cipher feedback mode of operation maintains internal state,
// so to decrypt a new instance must be instantiated.
var aesCfb = new aesjs.CFB(key, iv, 8);
var decryptedBytes = new Uint8Array(encryptedBytes.length);
aesCfb.decrypt(encryptedBytes, decryptedBytes);

// Convert our bytes back into text
var decryptedText = decoder.decode(decryptedBytes);
console.log(decryptedText);
// "TextMustBeAMultipleOfSegmentSize"
```


### OFB - Output Feedback

```javascript
var key = encoder.encode("Example128BitKey");

// The initialization vector, which must be 16 bytes
var iv = encoder.encode("IVMustBe16Bytes.");

// Convert text to bytes
var text = 'Text may be any length you wish, no padding is required.';
var textBytes = encoder.encode(text);

var aesOfb = new aesjs.OFB(key, iv);
var encryptedBytes = new Uint8Array(textBytes.length);
aesOfb.encrypt(textBytes, encryptedBytes);

// The output feedback mode of operation maintains internal state,
// so to decrypt a new instance must be instantiated.
var aesOfb = new aesjs.OFB(key, iv);
var decryptedBytes = new Uint8Array(encryptedBytes.length);
aesOfb.decrypt(encryptedBytes, decryptedBytes);

// Convert our bytes back into text
var decryptedText = decoder.decode(decryptedBytes);
console.log(decryptedText);
// "Text may be any length you wish, no padding is required."
```


### ECB - Electronic Codebook (NOT recommended)

This mode is **not** recommended. Since, for a given key, the same plaintext block in produces the same ciphertext block out, this mode of operation can leak data, such as patterns. For more details and examples, see the Wikipedia article, [Electronic Codebook](http://en.wikipedia.org/wiki/Block_cipher_mode_of_operation#Electronic_Codebook_.28ECB.29).

```javascript
var key = encoder.encode("Example128BitKey");

// Convert text to bytes
var text = 'TextMustBe16Byte';
var textBytes = encoder.encode(text);

var aesEcb = new aesjs.ECB(key);
var encryptedBytes = new Uint8Array(textBytes.length);
aesEcb.encrypt(textBytes, encryptedBytes);

// Since electronic codebook does not store state, we can
// reuse the same instance.
//var aesEcb = new aesjs.ECB(key);
var decryptedBytes = new Uint8Array(encryptedBytes.length);
aesEcb.decrypt(encryptedBytes, decryptedBytes);

// Convert our bytes back into text
var decryptedText = decoder.decode(decryptedBytes);
console.log(decryptedText);
// "TextMustBe16Byte"
```



Block Cipher
------------

You should usually use one of the above common modes of operation. Using the block cipher algorithm directly is also possible using **ECB** as that mode of operation is merely a thin wrapper.


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

A test suite has been generated (`spec/fixtures/test-vectors.json`) from a known correct implementation, [pycrypto](https://www.dlitz.net/software/pycrypto/). To generate new test vectors, run `npm run generate-tests`.

To run the test suite:

```
npm test
```
