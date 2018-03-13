import React from 'react'
import T from 'prop-types'
import { connect } from 'react-redux'
import moment from 'moment'
import withChildRoutes from '../../decorators/withChildRoutes'
import withStyles from '../../decorators/withStyles'
import globalStyle from '../../assets/styles/index.css'
import s from './App.css'
import Navigator from '../Navigator'
import MessageHandler from './MessageHandler'
import { UserActions } from '../../actions'
import { updateLocales } from '../../constant'

const { LocaleProvider, locales } = window.antd

const recurrentInterval = 30 * 60 * 1000 // 30mins

const antLocales = {
  en: 'en_US',
  zh_TW: 'zh_TW',
  zh_CN: 'zh_CN',
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
      const locale = antLocales[language]
      this.setState({ locale })
      moment.locale(locale.replace('_', '-'))
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
    let locale = locales[this.state.locale] || locales.zh_CN
    if (locale.default) locale = locale.default
    return (
      <LocaleProvider locale={locale}>
        <div className={s.container}>
          <Navigator.Major location={this.context.router.location} />
          {this.props.children}
          <MessageHandler />
        </div>
      </LocaleProvider>
    )
  }
}
