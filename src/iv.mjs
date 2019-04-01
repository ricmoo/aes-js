const zeroes = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

export function copyIV(iv) {
  return Array.prototype.slice.call(iv || zeroes, 0, 16);
}
