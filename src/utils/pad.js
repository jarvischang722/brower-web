export const pow10 = Array(10).fill(0).map((_, i) => 10 ** i)

export default (num, length) => {
  const w = pow10[length]
  return w > num ? `${w + num}`.slice(1) : num
}
