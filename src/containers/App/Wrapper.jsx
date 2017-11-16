import React from 'react'
import T from 'prop-types'
import { connect } from 'react-redux'
import { LocaleProvider } from 'antd'
import enUS from 'antd/lib/locale-provider/en_US'
import zhTW from 'antd/lib/locale-provider/zh_TW'
import withChildRoutes from '../../decorators/withChildRoutes'
import withStyles from '../../decorators/withStyles'
import globalStyle from '../../assets/styles/index.css'
import s from './App.css'
import Navigator from '../Navigator'
import MessageHandler from './MessageHandler'
import { UserActions } from '../../actions'
import { updateLocales } from '../../constant'

const recurrentInterval = 30 * 60 * 1000 // 30mins

const antLocales = {
  en: enUS,
  zh_TW: zhTW,
}

@connect(
  ({ user }) => ({
    user: (user && user.data) || {},
  }),
  { recurrent: UserActions.actions.recurrent }
)
@withChildRoutes
@withStyles(globalStyle, s)
export default class Wrapper extends React.Component {
  static propTypes = {
    children: T.element.isRequired,
    recurrent: T.func.isRequired,
    user: T.object.isRequired,
  }

  static contextTypes = {
    router: T.object.isRequired,
  }

  state = {
    locale: null,
  }

  componentDidMount() {
    this.mounted = true
    const { user } = this.props
    if (!user.id) this.recurrent(true)
    else {
      this.updateLocale(user.language)
      this.redirectToDefaultComponent()
      setTimeout(this.recurrent, recurrentInterval)
    }
  }

  componentWillReceiveProps({ user }) {
    this.updateLocale(user.language)
  }

  componentWillUnmount() {
    this.mounted = false
  }

  updateLocale = (language = 'en') => {
    if (this.language !== language) {
      this.language = language
      this.setState({ locale: antLocales[language] })
      i18n.setLocale(language)
      updateLocales()
    }
  }

  recurrent = (initial) => {
    if (!this.mounted) return
    this.props.recurrent(initial)
      .then(
        () => {
          const { user } = this.props
          if (!user.id) this.context.router.replace('/login')
          else {
            this.updateLocale(user.language)
            if (initial) this.redirectToDefaultComponent()
          }
          setTimeout(this.recurrent, recurrentInterval)
        }
      )
  }

  redirectToDefaultComponent() {
    const { user } = this.props
    const { router } = this.context
    if (router.location.pathname === '/') router.replace(user.role === 1 ? '/agents' : '/browser')
  }

  render() {
    const { user } = this.props
    if (!user.id) return <div />
    return (
      <LocaleProvider locale={this.state.locale}>
        <div className={s.container}>
          <Navigator.Major user={user} />
          {this.props.children}
          <MessageHandler />
        </div>
      </LocaleProvider>
    )
  }
}
