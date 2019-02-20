import { constructAsyncActionTypes } from './lib/actionTypes'
import { dispatch } from './lib'
import api from '../utils/api'

const name = 'promotion'

const $list = constructAsyncActionTypes(`${name}/LIST`)

const types = [$list]

const updateSort = data => dispatch(api.post('/promotion/updateSort', data))

const list = () => dispatch(api.get('/promotion/list'))

export default {
  name,
  types,
  actions: {
    updateSort,
    list
  }
}
