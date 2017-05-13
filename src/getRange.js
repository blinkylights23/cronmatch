
export default (a, b) => {
  a = parseInt(a);
  b = parseInt(b);
  if (a > b) {
    [a, b] = [b, a];
  }
  return Array.from({ length: (b - a+1) }, (v, k) => k + a);
};
