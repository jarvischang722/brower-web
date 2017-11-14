import React from 'react'
import T from 'prop-types'
import { Link } from 'react-router'
import withStyles from '../../decorators/withStyles'
import s from './Major.css'
import is from '../../utils/is'

@withStyles(s)
export default class MajorNavigator extends React.Component {
  static propTypes = {
    user: T.object.isRequired,
  }

  static contextTypes = {
    router: T.object.isRequired,
    childRoutes: T.arrayOf(T.shape({
      to: T.string.isRequired,
    })).isRequired,
  }

  isVisible = (route) => {
    if (is.function(route.visible)) return route.visible(this.props.user)
    return route.visible
  }

  renderContent() {
    const { router, childRoutes } = this.context
    const { pathname } = router.location
    const current = childRoutes.find(item => item.to !== '/' && pathname.startsWith(item.to))

    return childRoutes.map((item) => {
      if (!item.title) return null
      if (current && current.scope && item.scope !== current.scope) return null
      if (!this.isVisible(item)) return null

      const active = current && current.to === item.to

      return (
        <li key={item.to} className={active ? s.active : ''}>
          <Link to={item.to}>
            { item.icon && <i className={`sicon sicon-middle icon-${item.icon}`} /> }
            {i18n.t(item.title)}
          </Link>
        </li>
      )
    })
  }


  render() {
    return (
      <div className={s.container}>
        <div className={s.logoWrapper}>
          <div className={s.logo} />
        </div>
        <nav>
          <ul>
            {this.renderContent()}
          </ul>
        </nav>
      </div>
    )
  }
}
