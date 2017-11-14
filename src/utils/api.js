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
  api[method] = (path, body) => resolve(path).then(p => json[method](p, body))
})

export default api
