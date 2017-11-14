import createReducer from './createReducer'
import messageReducer from './messageReducer'
import * as actions from '../actions'

const models = {}

Object.keys(actions)
  .forEach((key) => {
    if (!!actions[key].types && actions[key].name) {
      const model = actions[key]
      models[model.name] = model.name === 'message' ? messageReducer(model) : createReducer(model)
    }
  })

export default models
