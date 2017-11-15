import { constructAsyncActionTypes } from './lib/actionTypes'
import api from '../utils/api'
import dispatch from './lib/dispatch'
import syncState from './lib/syncState'

const name = 'user'

const $profile = constructAsyncActionTypes(`${name}/PROFILE`)
const $LOGOUT = `${name}/LOGOUT`
const $SYNC_STATUS = `${name}/SYNC_STATUS`

const types = [
  $profile,
  $LOGOUT,
  $SYNC_STATUS,
]

const login = (username, password) =>
  dispatch(
    api.post('/user/login', { username, password }).then(
      ({ body }) => {
        if (localStorage) localStorage.setItem('t1bw_token', body.token)
        return $profile.async(
          api.get('/user/profile')
        )
      }
    )
  )

const recurrent = (reloadProfile) =>
  dispatch(
    api.get('/user/recurrent').then(
      ({ body }) => {
        if (localStorage) localStorage.setItem('t1bw_token', body.token)
        if (reloadProfile) {
          return $profile.async(
            api.get('/user/profile')
          )
        }
        return false
      }
    ),
    { silent: true }
  )

const logout = () => {
  if (localStorage) localStorage.removeItem('t1bw_token')
  return dispatch(
    syncState($LOGOUT, null)
  )
}

const changePassword = (oldPassword, password) =>
  dispatch(
    api.post('/auth/changepassword', { oldPassword, password }).then(
      ({ body }) => {
        const { status } = body
        return syncState($SYNC_STATUS, body, {
          status: { $set: status }
        })
      }
    ),
    { success: i18n.t('auth.message.password_changed') }
  )

const profile = () =>
  dispatch(
    $profile.async(
      api.get('/user/profile')
    )
  )

const update = (data) =>
  dispatch(
    $profile.async(
      api.post('/user/profile', data)
    )
  )

export default {
  name,
  types,
  actions: {
    login,
    recurrent,
    logout,
    changePassword,
    profile,
    update,
  },
}
