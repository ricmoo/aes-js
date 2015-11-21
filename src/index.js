"use strict";

var AES = require('./aes');

var ecb = require('./ecb');
var cbc = require('./cbc');
var cfb = require('./cfb');
var ofb = require('./ofb');
var ctr = require('./ctr');
var Counter = require('./counter');


    // The bsic modes of operation as a map
    var ModeOfOperation = {
        ecb: ecb,
        cbc: cbc,
        cfb: cfb,
        ofb: ofb,
        ctr: ctr
    };


module.exports = {
  AES: AES,
  Counter: Counter,
  ModeOfOperation: ModeOfOperation
};

