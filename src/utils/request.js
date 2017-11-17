export default function request(opts) {
  const url = opts.url

  const $method = opts.method || 'GET'
  const $headers = Object.assign({
    'X-Requested-With': 'XMLHttpRequest',
  }, opts.headers || {})
  const $body = opts.body
  const $timeout = opts.timeout || 60000

  const xhr = new XMLHttpRequest()
  const getHeaders = () =>
    xhr.getAllResponseHeaders().split('\n')
      .reduce((header, entry) => {
        const temp = entry.split(': ')
        const k = temp[0]
        const v = temp[1]
        if (k && v) header[k] = v
        return header
      }, {})

  const fetch = new Promise((resolve, reject) => {
    xhr.open($method, url, true)
    Object.keys($headers).forEach((key) => {
      xhr.setRequestHeader(key, $headers[key])
    })

    // handle timeout
    if ($timeout > 0) {
      if (xhr.timeout !== null) {
        xhr.timeout = $timeout
        xhr.ontimeout = () => {
          xhr.hasTimeout = true
          reject({
            body: {
              error: 'RequestTimeout',
            },
          })
        }
      } else {
        setTimeout(() => {
          xhr.abort()
          xhr.hasTimeout = true
        }, $timeout)
      }
    }

    // handle response
    xhr.onload = () => {
      const status = xhr.status
      const headers = getHeaders()
      let body = xhr.response || xhr.responseText
      const contentType = headers['Content-Type'] || headers['content-type']
      if (contentType && contentType.indexOf('json') > -1) {
        try {
          body = JSON.parse(body)
        } catch (e) {
          // TODO: 处理不是json的错误
        }
      }

      const response = {
        status,
        headers,
        body,
      }

      // sometimes IE returns 1223 when it should be 204
      if (/^2|304|1223/.test(status)) resolve(response)
      else {
        response.type = 'error'
        reject(response)
      }
    }
    xhr.onerror = () => {
      reject({
        type: 'error',
        status: xhr.status,
        headers: getHeaders(),
        body: xhr.response || xhr.responseText,
      })
    }
    xhr.onabort = () => {
      reject({
        body: {
          error: xhr.hasTimeout ? 'RequestTimeout' : 'RequestAbort',
        },
      })
    }
    xhr.withCredentials = true
    xhr.send($body)
  })

  fetch.abort = xhr.abort.bind(xhr) // abortable

  return fetch
}

const formatFormData = (body) => {
  if (!body) return undefined
  const { isFormData, ...rest } = body
  delete body.isFormData
  if (!isFormData) return false
  const data = new FormData()
  Object.keys(rest).forEach(key => {
    const value = rest[key]
    if (Array.isArray(value)) {
      value.forEach(v => data.append(`${key}[]`, v))
    } else {
      data.append(key, rest[key])
    }
  })
  return data
}

export const json = {
  methods: ['get', 'post', 'put', 'delete', 'options'],
}

json.methods.forEach((method) => {
  json[method] = (url, body, headers, opts) => {
    if (method === 'get') {
      /* eslint-disable no-param-reassign */
      opts = headers
      headers = body
      body = undefined
    }

    if (!headers) headers = {}

    const isFormData = body && body.isFormData

    if (!isFormData) headers['Content-Type'] = 'application/json'

    return request(Object.assign({
      url,
      method: method.toUpperCase(),
      body: formatFormData(body) || JSON.stringify(body),
      headers,
    }, opts))
  }
})
