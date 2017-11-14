import React from 'react'
import T from 'prop-types'
import { connect } from 'react-redux'
import { UserActions } from '../../actions'
import Agent from '../Subordinate/Agent/Profile'
import Company from '../Subordinate/Company/Profile'

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
    const { user } = this.props
    const Component = user.role > 1 ? Agent : Company
    return <Component {...this.props} />
  }
}
