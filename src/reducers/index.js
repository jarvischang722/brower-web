import { combineReducers } from 'redux'

import models from './models'

const appReducer = combineReducers({
  ...models,
})

export default (state, action) => {
  // eslint-disable-next-line no-param-reassign
  if (action.type === 'user/LOGOUT_SUCCESS') state = undefined
  return appReducer(state, action)
}
