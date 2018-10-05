import { constructAsyncActionTypes } from './lib/actionTypes'
import { dispatch, query } from './lib'
import api from '../utils/api'

const name = 'player'

const $list = constructAsyncActionTypes(`${name}/LIST`)

const types = [
  $list,
]

const get = id =>
  dispatch(
    api.get(`/player/detail?playerId=${id}`)
  )

const updateSta = data =>
  dispatch(
    api.post('/player/updateSta', data)
  )

const list = (pagination, filters) =>
  dispatch(
    $list.async(
      api.get(`/player/list${query(pagination, filters)}`)
    )
  )

export default {
  name,
  types,
  actions: {
    get,
    updateSta,
    list,
  },
}
