import url from 'url'
import { json } from './request'

const api = {}

const resolve = (path) =>
  new Promise((done) => {
    if (!api.basename) {
      json.get('/assets/config.json').then(
        ({ body }) => {
          api.basename = body.api
          done(url.resolve(api.basename, path))
        }
      )
    } else {
      done(url.resolve(api.basename, path))
    }
  })


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
