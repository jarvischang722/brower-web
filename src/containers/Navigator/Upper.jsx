import React from 'react'
import T from 'prop-types'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import { Breadcrumb, Dropdown, Icon } from 'antd'
import withStyles from '../../decorators/withStyles'
import s from './Upper.css'

const BreadcrumbItem = Breadcrumb.Item

@connect(
  ({ user }) => ({
    user: user.data || {},
  })
)
@withStyles(s)
export default class Upper extends React.Component {
  static propTypes = {
    user: T.object.isRequired,
  }

  static contextTypes = {
    router: T.object.isRequired,
  }

  getUsername = () => {
    const { user } = this.props
    if (user.sub) return user.sub.username
    return user.name || user.username
  }

  renderBreadcrumbItem = (route, withPath) => {
    if (!route.title) return null
    return withPath ?
      <BreadcrumbItem><Link to={route.path}>{i18n.t(route.title)}</Link></BreadcrumbItem> :
      <BreadcrumbItem>{i18n.t(route.title)}</BreadcrumbItem>
  }

  renderCapital() {
    const { routes } = this.context.router
    const length = routes.length
    return (
      <div className={s.capital}>
        <Breadcrumb>
          {
            routes.map((route, i) => this.renderBreadcrumbItem(route, i !== length - 1))
          }
        </Breadcrumb>
      </div>
    )
  }

  renderOverlay = () => {
    const links = []
    const count = links.length || 1
    return (
      <div className={s.overlay} style={{ width: (Math.min(count, 3) * 100 + 2) + 20 }}>
        <div className={s.cards}>{links}</div>
        <div className={s.exit}>
          <Link to="/logout">
            <i className="sicon icon-exit" /> {i18n.t('auth.logout')}
          </Link>
        </div>
      </div>
    )
  }

  render() {
    return (
      <div className={s.container}>
        <div className={s.content}>
          {this.renderCapital()}
          <div className={s.dropdown}>
            <Dropdown overlay={this.renderOverlay()} trigger={['click']}>
              <a className="ant-dropdown-link">
                {i18n.t('hello', { name: this.getUsername() })} <i className="sicon sicon-middle icon-down" />
              </a>
            </Dropdown>
          </div>
        </div>
      </div>
    )
  }
}
