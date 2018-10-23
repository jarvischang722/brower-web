import { constructAsyncActionTypes } from './lib/actionTypes'
import { dispatch } from './lib'
import api from '../utils/api'

const name = 'player'

const $list = constructAsyncActionTypes(`${name}/LIST`)

const types = [$list]

const get = id => dispatch(api.get(`/player/detail?playerId=${id}`))

const updateSta = data => dispatch(api.post('/player/updateSta', data))

const list = (page, pagesize) => dispatch($list.async(api.post('/player/list', { page, pagesize })))

export default {
  name,
  types,
  actions: {
    get,
    updateSta,
    list
  }
}
