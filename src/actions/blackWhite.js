import { constructAsyncActionTypes } from './lib/actionTypes'
import { dispatch, query } from './lib'
import api from '../utils/api'

const name = 'blackWhite'

const $list = constructAsyncActionTypes(`${name}/LIST`)

const types = [
  $list,
]

const get = id =>
  dispatch(
    api.get(`/blackWhite/detail?userid=${id}`)
  )

const update = data =>
  dispatch(
    api.post('/blackWhite/update', data)
  )

const list = (pagination, filters) =>
  dispatch(
    $list.async(
      api.get(`/blackWhite/list${query(pagination, filters)}`)
    )
  )

export default {
  name,
  types,
  actions: {
    get,
    update,
    list,
  },
}
