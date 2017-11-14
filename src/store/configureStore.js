import { createStore, applyMiddleware } from 'redux'
import thunkMiddleware from 'redux-thunk'
import promiseMiddleware from 'redux-promise-middleware'
import rootReducer from '../reducers'
import { promiseTypeSuffixes } from '../actions/lib/actionTypes'

const configureStore = preloadState => createStore(
  rootReducer,
  preloadState,
  applyMiddleware(
    thunkMiddleware,
    promiseMiddleware({ promiseTypeSuffixes })
  )
)

export default configureStore
