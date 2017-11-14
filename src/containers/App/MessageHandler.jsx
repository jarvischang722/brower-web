import React from 'react'
import T from 'prop-types'
import { connect } from 'react-redux'
import { Modal } from 'antd'
import Message from '../../components/Message'
import MessageActions from '../../actions/message'

@connect(
  ({ message }) => ({
    message,
  }),
  {
    openMessage: MessageActions.actions.open,
  }
)
export default class MessageHandler extends React.Component {
  static propTypes = {
    message: T.object,
    openMessage: T.func.isRequired,
  }

  static defaultProps = {
    message: {},
  }

  static contextTypes = {
    router: T.object.isRequired,
  }

  componentWillMount() {
    this.lastError = null
  }

  componentWillReceiveProps({ message }) {
    this.handleMessage(message)
  }

  resetMessge = () => {
    Message.clear()
  }

  handleMessage = (message) => {
    if (!message.opened) {
      this.props.openMessage()
      const { title, body, codename } = message.envelope
      switch (message.type) {
        case 'error':
        {
          if (codename === 'RequestAbort' || this.lastError === codename) return
          this.lastError = codename
          let content
          if (codename === 'ValidationFailed') content = `Validation Failed: ${body}`
          else if (codename) content = i18n.t(`errors.${codename}`)
          if (!content || content.replace(' ', '') === codename) content = body
          const modal = {
            title: title || i18n.t('message.error'),
            content,
          }
          if (codename === 'Unauthorized') {
            modal.onOk = () => {
              this.lastError = null
              const { router } = this.context
              if (router.location.pathname !== '/login') router.push('/logout')
            }
          } else {
            modal.onOk = () => {
              this.lastError = null
            }
          }
          Modal.error(modal)
          break
        }
        case 'success':
          Message.success(body)
          break
        default:
      }
    }
  }

  render() {
    return null
  }
}
