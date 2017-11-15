import MessageActions from '../message'
import is from '../../utils/is'

export default (action, { success, silent } = {}) =>
  (dispatch) => {
    const promise = is.promise(action) ?
      action :
      new Promise((resolve) => resolve(action))
    return promise
      .then(
        (response) => {
          if (success) dispatch(MessageActions.actions.success(success))
          if (response) {
            if (response.type && (is.promise(response.payload) || is.object(response.data))) {
              return dispatch(response)
            }
            if (response.body) {
              return response.body
            } else if (response.value) {
              return response.value.body || {}
            }
          }
          return {}
        },
        (response) => {
          if (!silent) dispatch(MessageActions.actions.error(response.body || { codename: 'ConnectionRefused' }))
          return { error: true }
        }
      )
  }
