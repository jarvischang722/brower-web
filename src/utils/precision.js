import { pow10 } from './pad'

// 修复js下小数位出现多位的情况
// 默认支持小数点后存有4位的数字
export default (n, count = 4) => {
  const p = pow10[count]
  return Math.round(n * p) / p
}
