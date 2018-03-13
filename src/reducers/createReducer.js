import update from 'immutability-helper'
import { promiseTypeSuffixes } from '../actions/lib/actionTypes'

function getInnerUpdate(state, data, partial, $update) {
  switch (typeof partial) {
    case 'string':
      if (data.hasOwnProperty(partial)) $update[partial] = { $set: data[partial] }
      break
    case 'number':
      $update[partial] = { $set: data[partial] }
      break
    case 'object':
      if (partial instanceof Array) {
        partial.forEach((item) => {
          getInnerUpdate(state, data, item, $update)
        })
      } else {
        for (const key in partial) {
          if (key[0] === '$') {
            const $key = partial[key]
            if (data.hasOwnProperty($key)) {
              $update[$key] = { [key]: data[$key] }
            }
          } else if (data.hasOwnProperty(key) || typeof key === 'number') {
            if (!state.hasOwnProperty(key)) {
              $update[key] = { $set: data[key] }
            } else {
              const inner = {}
              $update[key] = inner
              getInnerUpdate(state[key], data[key], partial[key], inner)
            }
          }
        }
      }
      break
    default:
  }
}

function getPartialUpdte(state, data, partial) {
  const $update = {}
  if (partial instanceof Array) {
    partial.forEach((item) => {
      getInnerUpdate(state, data, item, $update)
    })
  } else {
    getInnerUpdate(state, data, partial, $update)
  }
  return $update
}

function processMetaUpdate(state, newState, data, meta) {
  if (!state.data) return false
  const { key, partial } = meta
  if (key && !state.data[key]) {
    newState.data = { [key]: { $set: data } }
    return true
  }
  if (partial) {
    if (key) newState.data = { [key]: getPartialUpdte(state.data[key], data, partial) }
    else newState.data = getPartialUpdte(state.data, data, partial)
    return true
  }
  return false
}

const createActionMap = (model, actions) => {
  const actionsMap = {}
  actions.forEach((asyncAction) => {
    if (typeof asyncAction === 'string') {
      actionsMap[asyncAction] = (state, action) => {
        const newState = {
          status: { $set: 'SUCCESS' },
        }
        const { data, meta, $update } = action
        if ($update) {
          newState.data = $update
          return update(state, newState)
        }
        if (!meta || !processMetaUpdate(state, newState, data, meta)) {
          if (meta && meta.key) {
            if (!state.data) newState.data = { $set: { [meta.key]: data } }
            else newState.data = { [meta.key]: { $set: data } }
          } else newState.data = { $set: data }
        }
        newState.opt = {
          $set: (action.opt ?
            `${asyncAction}@${action.opt}` :
            asyncAction
          ).slice(model.length + 1),
        }
        return update(state, newState)
      }
    } else {
      promiseTypeSuffixes.forEach((type) => {
        actionsMap[asyncAction[type]] = (state, action) => {
          const newState = {
            status: { $set: type },
            opt: { $set: asyncAction.ORIGIN.slice(model.length + 1) },
          }
          switch (type) {
            case 'SUCCESS': {
              const { $update } = action.payload
              if ($update) {
                newState.data = $update
                return update(state, newState)
              }
              const body = action.payload.body || action.payload.data
              if (action.type.indexOf('/DELETE') !== -1) {
                if (!body.status) {
                  newState.status = { $set: 'FAILURE' }
                } else {
                  newState.opt = { $set: `${newState.opt.$set}:${body.opt}` }
                }
              } else {
                const meta = action.meta || action.payload.meta
                if (action.payload.type) newState.opt = { $set: `${newState.opt.$set}:${action.payload.type}` }
                if (!meta || !processMetaUpdate(state, newState, body, meta)) {
                  if (meta && meta.key) {
                    if (!state.data) newState.data = { $set: { [meta.key]: body } }
                    else newState.data = { [meta.key]: { $set: body } }
                  } else newState.data = { $set: body }
                }
              }
              newState.error = { $set: null }
              break
            }
            case 'FAILURE':
              newState.error = { $set: action.payload.body }
              break
            default:
          }
          return update(state, newState)
        }
      })
    }
  })
  return actionsMap
}

const createReducer = (actions) => {
  const { name, types } = actions
  const actionMap = createActionMap(name, types)
  const initState = {
    model: name,
    data: {},
    status: '',
    error: null,
    opt: '',
  }
  return (state = initState, action) => {
    const plan = actionMap[action.type]
    if (plan) {
      return plan(state, action) || state
    }
    return state
  }
}

export default createReducer
