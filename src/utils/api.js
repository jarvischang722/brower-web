import url from 'url'
import { json } from './request'

const api = {}

const resolve = (path) =>
  new Promise((r) => {
    if (!api.basename) {
      json.get('/assets/config.json').then(
        ({ body }) => {
          api.basename = body.api
          r(url.resolve(api.basename, path))
        }
      )
    } else {
      r(url.resolve(api.basename, path))
    }
  })


json.methods.forEach((method) => {
  api[method] = (path, body) =>
    resolve(path).then(
      p => method === 'get' ? json.get(p) : json[method](p, body)
    )
})

export default api
