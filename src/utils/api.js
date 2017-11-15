import url from 'url'
import { json } from './request'

let basename

const resolve = (path) =>
  new Promise((r) => {
    if (!basename) {
      json.get('/assets/config.json').then(
        ({ body }) => {
          basename = body.api
          r(url.resolve(basename, path))
        }
      )
    } else {
      r(url.resolve(basename, path))
    }
  })

const api = {}

json.methods.forEach((method) => {
  api[method] =
    (path, body) =>
      resolve(path).then(
        p => {
          const headers = {}
          const token = localStorage && localStorage.getItem('t1bw_token')
          if (token && token !== 'undefined') headers['X-Auth-Key'] = token
          return method === 'get' ? json.get(p, headers) : json[method](p, body, headers)
        }
      )
})

export default api
