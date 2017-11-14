import is from '../../utils/is'

export default (type, data, opt, meta) => {
  const action = { type, data }
  const update = is.object(opt) ? opt // opt is string, or its meta as object
    : meta
  if (is.object(update)) {
    if (/{(['"]?)\$[a-z]+\1:/.test(JSON.stringify(update))) action.$update = update
    else action.meta = update
  }
  return action
}
