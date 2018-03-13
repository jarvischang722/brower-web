import React from 'react'
import T from 'prop-types'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import { Badge, Menu } from 'antd'
import withStyles from '../../decorators/withStyles'
import s from './Major.css'
import is from '../../utils/is'

const { SubMenu, Item } = Menu

@connect(
  ({ user }) => ({ user: user.data })
)
@withStyles(s)
export default class MajorNavigator extends React.Component {
  static propTypes = {
    user: T.object.isRequired,
  }

  static contextTypes = {
    store: T.object.isRequired,
    router: T.object.isRequired,
    childRoutes: T.arrayOf(T.shape({
      to: T.string.isRequired,
    })).isRequired,
  }

  state = {}

  isVisible = (route) => {
    if (is.function(route.visible)) return route.visible(this.props.user)
    return route.visible
  }

  badge = (link, ref) => {
    if (!ref) return link
    const path = ref.split('.')
    let data = this.context.store.getState()[path[0]]
    if (!data) return link
    data = data.data
    for (let i = 1; i < path.length; i++) {
      data = data[path[i]]
      if (!data) return link
    }
    return (
      <Badge dot>
        {link}
      </Badge>
    )
  }

  toggleSubMenu = ({ key }) => {
    let openedParent
    const { actived, openedSubMenu } = this.state
    if (actived) [, openedParent] = actived.split('@')
    if (openedParent === key) return
    if (openedSubMenu === key) this.setState({ openedSubMenu: null })
    else this.setState({ openedSubMenu: key })
  }

  renderItems = (childRoutes, pathname, parent) => {
    const current = childRoutes.find(
      item =>
        item.to === '/' ? pathname === '/' : item.to && pathname.startsWith(item.to)
    )

    childRoutes.sort((a, b) => a.index - b.index)
    return childRoutes
      .map((item) => {
        item.realTitle = is.function(item.title) ? item.title(this.props.user) : item.title
        if (
          !item.realTitle ||
          (current && current.scope && item.scope !== current.scope) ||
          !this.isVisible(item)
        ) {
          if (
            current &&
            current.realTitle === item.realTitle &&
            this.state.actived) {
            this.setState({ actived: null })
          }
          return null
        }

        if (current && current.realTitle === item.realTitle) {
          const actived = parent ? `${current.realTitle}@${parent.realTitle}` : current.realTitle
          if (this.state.actived !== actived) {
            const update = { actived }
            if (!parent || this.state.openedSubMenu !== parent.realTitle) {
              update.openedSubMenu = null
            }
            this.setState(update)
          }
        }

        if (item.to) {
          const link = (
            <span className={s.link}>
              { item.icon && <i className={`sicon sicon-middle icon-${item.icon}`} /> }
              {i18n.t(item.realTitle)}
            </span>
          )
          return (
            <Item key={item.realTitle}>
              <Link to={item.to}>
                { this.badge(link, item.badge) }
              </Link>
            </Item>
          )
        }
        if (item.children) {
          return (
            <SubMenu
              key={item.realTitle}
              title={i18n.t(item.realTitle)}
              onTitleClick={this.toggleSubMenu}>
              {this.renderItems(item.children, pathname, item)}
            </SubMenu>
          )
        }
        return null
      })
  }

  renderContent() {
    const { router, childRoutes } = this.context
    return this.renderItems(childRoutes, router.location.pathname)
  }


  render() {
    let openedParent
    let selected
    const { actived, openedSubMenu } = this.state
    if (actived) [selected, openedParent] = actived.split('@')
    return (
      <div className={s.container}>
        <div className={s.logoWrapper}>
          <div className={s.logo}>
            Browser Web
          </div>
        </div>
        <Menu
          theme="dark"
          mode="inline"
          openKeys={[openedParent, openedSubMenu]}
          selectedKeys={[selected]}>
          {this.renderContent()}
        </Menu>
      </div>
    )
  }
}
