"use strict";

var makeBlock, copyBlock, memMove;

if (typeof Buffer === 'undefined') {
  makeBlock = function(size) {
    var buffer = new ArrayBuffer(size || 16);
    return new DataView(buffer);
  };

} else {
  makeBlock = function(size) {
    var DataView = require('buffer-dataview');
    var buffer = new Buffer(size || 16);
    return new DataView(buffer);
  };
}

copyBlock = function(block) {
  var c = makeBlock(block.byteLength);
  memMove(block, 0, block.byteLength, c, 0);
  return c;
};

memMove = function(src, srcOffset, srcLength, dst, dstOffset) {
  while (srcLength--) {
    dst.setUint8(dstOffset++, src.getUint8(srcOffset++));
  }
};
  
module.exports = {
  makeBlock: makeBlock,
  copyBlock: copyBlock,
  memMove: memMove
};

