import React from 'react'
import T from 'prop-types'
import { connect } from 'react-redux'
import { Tabs, Icon } from 'antd'
import { UserActions } from '../../actions'
import ContentWrapper from '../App/ContentWrapper'
import { Section } from '../../components'
import withStyles from '../../decorators/withStyles'
import s from './Account.css'

const { TabPane } = Tabs

const panes = [
  { key: 'profile', path: '', visible: () => true },
  { key: 'keys', path: '/keys', visible: (user) => user.role > 1 },
  { key: 'player_settings', path: '/player_settings', visible: (user) => user.role === 2 },
  { key: 'security', path: '/security', visible: () => true }
]

@connect(
  ({ user }) => ({
    user: user.data || {},
  }),
  { reload: UserActions.actions.profile }
)
@withStyles(s)
export default class Wrapper extends React.Component {
  static propTypes = {
    user: T.object.isRequired,
    children: T.object.isRequired,
    reload: T.func.isRequired,
  }

  static contextTypes = {
    router: T.object.isRequired,
  }

  componentWillMount() {
    this.props.reload()
  }

  changePane = (key) => {
    const { path } = panes.find(pane => pane.key === key)
    this.context.router.push(`/account${path}`)
  }

  render() {
    const { children, user, ...rest } = this.props
    const pathname = this.context.router.location.pathname.replace('/account', '')
    const pane = panes.find(({ path }) => path && pathname.startsWith(path)) || panes[0]
    return (
      <ContentWrapper {...rest}>
        <Section
          title={(
            <div className={s.nav}>
              <Icon type="idcard" />
              <span>{i18n.t('account.title')}</span>
              <span className="ant-breadcrumb-separator">/</span>
              <span className={s.paneTitle}>{i18n.t(`account.${pane.key}`)}</span>
            </div>
          )} />
        <Tabs onChange={this.changePane} activeKey={pane.key}>
          { panes.filter(({ visible }) => visible(user)).map(({ key }) => <TabPane tab={i18n.t(`account.${key}`)} key={key} />) }
        </Tabs>
        <div style={{ paddingLeft: 20 }}>
          { children }
        </div>
      </ContentWrapper>
    )
  }
}
