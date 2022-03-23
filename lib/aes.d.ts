/*! MIT License. Copyright 2015-2022 Richard Moore <me@ricmoo.com>. See LICENSE.txt. */
export declare class AES {
    #private;
    get key(): Uint8Array;
    constructor(key: Uint8Array);
    encrypt(plaintext: Uint8Array): Uint8Array;
    decrypt(ciphertext: Uint8Array): Uint8Array;
}
/**
 *  Mode Of Operation - Electonic Codebook (ECB)
 */
/**
 *  Mode Of Operation - Cipher Block Chaining (CBC)
 */
/**
 *  Mode Of Operation - Cipher Feedback (CFB)
 */
/**
 *  Mode Of Operation - Output Feedback (OFB)
 */
/**
 *  Counter object for CTR common mode of operation
 */
/**
 *  Mode Of Operation - Counter (CTR)
 */
