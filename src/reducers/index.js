import { combineReducers } from 'redux'

import models from './models'

const appReducer = combineReducers({
  ...models,
})

export default (state, action) => {
  if (action.type === 'user/LOGOUT_SUCCESS') state = undefined
  return appReducer(state, action)
}
