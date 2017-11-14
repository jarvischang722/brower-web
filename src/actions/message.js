const $SYNC = 'message/SYNC'
const $OPEN = 'message/OPEN'

const types = [
  $SYNC,
  $OPEN,
]

function sync(type, message, codename) {
  /* eslint-disable no-param-reassign */
  if (!codename) {
    codename = message.codename || (message.error && message.error.code) || ''
  }
  if (codename.endsWith('Error')) {
    codename = codename.slice(0, -5)
  }
  const newState = {
    type,
    title: message.title || '',
    body: message.message || message.error || message || '',
    codename,
  }
  return {
    type: $SYNC,
    data: newState,
  }
}

function error(message, codename) {
  return sync('error', message.body || message, codename)
}

function success(message, codename) {
  return sync('success', message.body || message, codename)
}


function open() {
  return {
    type: $OPEN,
  }
}

export default {
  name: 'message',
  types,
  actions: {
    error,
    success,
    open,
  },
}
