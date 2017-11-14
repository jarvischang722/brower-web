import update from 'immutability-helper'

const createActionMap = (actions) => {
  const actionsMap = {}
  actions.forEach((messageAction) => {
    actionsMap[messageAction] = (state, action) => {
      let newState
      switch (action.type) {
        case 'message/OPEN':
          newState = {
            opened: { $set: true },
          }
          break
        case 'message/SYNC':
          newState = {
            type: { $set: action.data.type },
            envelope: { $set: action.data },
            opened: { $set: false },
          }
          break
        default:
      }
      return update(state, newState)
    }
  })
  return actionsMap
}

const messageReducer = (actions) => {
  const actionMap = createActionMap(actions.types)
  const initState = {
    type: '',
    envelope: {},
    opened: true,
  }
  return (state = initState, action) => {
    const plan = actionMap[action.type]
    if (plan) {
      return plan(state, action) || state
    }
    return state
  }
}

export default messageReducer
