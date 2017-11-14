const callbacks = {}

function register(target, callback) {
  if (!target.$tickerID) target.$tickerID = Math.random()
  callbacks[target.$tickerID] = callback
}

function unregister(target) {
  delete callbacks[target.$tickerID]
}

function hit() {
  const now = Date.now()
  Object.keys(callbacks).forEach(key => {
    const cb = callbacks[key]
    cb(now)
  })
}

setInterval(hit, 1000)

export default {
  register,
  unregister,
}
