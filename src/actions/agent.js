import { constructAsyncActionTypes } from './lib/actionTypes'
import { dispatch, query } from './lib'
import api from '../utils/api'

const name = 'agents'

const $list = constructAsyncActionTypes(`${name}/LIST`)

const types = [
  $list,
]

const get = id =>
  dispatch(
    api.get(`/user/profile?id=${id}`)
  )

const create = data =>
  dispatch(
    api.post('/user/create', data)
  )

const update = data =>
  dispatch(
    api.post('/user/profile', data),
    { success: i18n.t('agent.message.success.update', { name: data.name }) }
  )

const list = (pagination, filters) =>
  dispatch(
    $list.async(
      api.get(`/user/list${query(pagination, filters)}`)
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
