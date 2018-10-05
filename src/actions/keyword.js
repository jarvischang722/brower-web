import { constructAsyncActionTypes } from './lib/actionTypes'
import { dispatch, query } from './lib'
import api from '../utils/api'

const name = 'keyword'

const $list = constructAsyncActionTypes(`${name}/LIST`)

const types = [$list]

const get = id => dispatch(api.get(`/keyword/detail?id=${id}`))

const update = data => dispatch(api.post('/keyword/update', data))

const deleteKeyword = data => dispatch(api.post('/keyword/delete', data))

const list = (pagination, filters) =>
  dispatch($list.async(api.get(`/keyword/list${query(pagination, filters)}`)))

export default {
  name,
  types,
  actions: {
    get,
    update,
    deleteKeyword,
    list
  }
}
