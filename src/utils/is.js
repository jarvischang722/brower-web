const types = ['undefined', 'function', 'string', 'number', 'object', 'boolean', 'symbol']

const f = {}

types.forEach(t => {
  f[t] = (target) => typeof target === t
})

// f.NaN = (target) => {
//   if (target === null || target === '') return false
//   return Number.isNaN(+target)
// }

f.promise = (target) => target && f.function(target.then)

f.array = (target) => target && Array.isArray(target)

f.reactElement = (target) => (target.$$typeof && target.$$typeof.toString() === 'Symbol(react.element)') || (target.type && target.type.prototype && target.type.prototype.isReactComponent)

export default f
