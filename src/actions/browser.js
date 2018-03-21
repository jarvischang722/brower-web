import { constructAsyncActionTypes } from './lib/actionTypes'
import { dispatch } from './lib'
import api from '../utils/api'

const name = 'agents'

const $list = constructAsyncActionTypes(`${name}/LIST`)

const types = [
  $list,
]

const create = data =>
  dispatch(
    api.post('/browser/info', data)
  )

const list = (user) =>
  dispatch(
    api.get(`/browser/list?user=${user}`)
  )

const generateWindowsBrowser = (user) =>
  dispatch(
    api.post('/browser/create', { id: user })
  )
export default {
  name,
  types,
  actions: {
    create,
    list,
    generateWindowsBrowser,
  },
}
