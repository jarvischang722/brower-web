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
    api.post('/browser/info', data),
    { success: i18n.t('browser.message.version_add_success', { platform: data.platform }) }
  )

const list = (user) =>
  dispatch(
    api.get(`/browser/list?user=${user}`)
  )

const generateBrowser = (user, platform) =>
  dispatch(
    api.post('/browser/create', { id: user, platform })
  )

export default {
  name,
  types,
  actions: {
    create,
    list,
    generateBrowser
  },
}
