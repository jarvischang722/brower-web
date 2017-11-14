import React from 'react'
import T from 'prop-types'
import { connect } from 'react-redux'
import { UserActions } from '../../actions'

@connect(
  ({ user }) => ({
    user: user.data || {},
  }),
  { save: UserActions.actions.update }
)
export default class Profile extends React.Component {
  static propTypes = {
    user: T.object.isRequired,
  }

  render() {
    return null
  }
}
