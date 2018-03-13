import is from './is'

export default (data) => {
  const keys = Object.keys(data)
  if (keys.length === 0) return ''
  const query = keys
    .filter(key => {
      const value = data[key]
      return !is.undefined(value) &&
        (!is.array(value) || value.join('').length > 0) &&
        (!is.string(value) || value)
    })
    .map(key => {
      const value = data[key]
      return `${encodeURIComponent(key)}=${encodeURIComponent(is.array(value) ? value.join() : value)}`
    })
    .join('&')
  return query ? `?${query}` : ''
}
