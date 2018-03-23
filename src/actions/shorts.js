import { constructAsyncActionTypes } from './lib/actionTypes'
import { dispatch, query } from './lib'
import api from '../utils/api'

const name = 'shorts'

const $list = constructAsyncActionTypes(`${name}/LIST`)

const types = [
  $list,
]

const get = id =>
  dispatch(
    api.get(`/short/detail?id=${id}`)
  )

const create = data =>
  dispatch(
    api.post('/short/add', data)
  )

const update = data =>
  dispatch(
    api.post('/short/update', data)
  )

const list = (pagination, filters) =>
  dispatch(
    $list.async(
      api.get(`/short/list${query(pagination, filters)}`)
    )
  )

export default {
  name,
  types,
  actions: {
    get,
    create,
    update,
    list,
  },
}
