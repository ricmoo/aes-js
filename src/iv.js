var zeroes = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

module.exports = function(iv) {
  return Array.prototype.slice.call(iv || zeroes, 0, 16);
};

