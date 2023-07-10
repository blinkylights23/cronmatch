export default (a, b) => {
  let aInt = parseInt(a, 10)
  let bInt = parseInt(b, 10)
  if (aInt > bInt) {
    ;[aInt, bInt] = [bInt, aInt]
  }
  return Array.from({ length: bInt - aInt + 1 }, (v, k) => k + aInt)
}
