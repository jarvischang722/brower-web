import React from 'react'
import T from 'prop-types'
import { connect } from 'react-redux'
import { UserActions } from '../../actions'

@connect(
  null,
  { logout: UserActions.actions.logout }
)
export default class Logout extends React.Component {
  static propTypes = {
    logout: T.func.isRequired,
  }

  static contextTypes = {
    router: T.object.isRequired,
  }

  componentDidMount() {
    this.props.logout()
      .then(
        () => this.context.router.replace('/login')
      )
  }

  render() {
    return null
  }
}
