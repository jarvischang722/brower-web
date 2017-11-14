import { constructAsyncActionTypes } from './lib/actionTypes'
import api from '../utils/api'
import dispatch from './lib/dispatch'
import syncState from './lib/syncState'

const name = 'user'

const $logout = constructAsyncActionTypes(`${name}/LOGOUT`)
const $profile = constructAsyncActionTypes(`${name}/PROFILE`)
const $SYNC_STATUS = `${name}/SYNC_STATUS`

const types = [
  $logout,
  $profile,
  $SYNC_STATUS,
]

const login = (username, password) =>
  dispatch(
    api.post('/auth/login', { username, password }).then(
      () =>
        $profile.async(
          api.get('/profile')
        )
    )
  )

const recurrent = (reloadProfile) =>
  dispatch(
    api.get('/auth/recurrent').then(
      () =>
        reloadProfile &&
        $profile.async(
          api.get('/profile')
        )
    ),
    { silent: true }
  )

const logout = () =>
  dispatch(
    $logout.async(
      api.get('/auth/logout')
    )
  )

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
      api.get('/profile')
    )
  )

const update = (data) =>
  dispatch(
    $profile.async(
      api.post('/profile', data)
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
