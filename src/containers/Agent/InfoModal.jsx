import React from 'react'
import T from 'prop-types'
import { Modal, Icon, Button } from 'antd'
import CopyToClipboard from 'react-copy-to-clipboard'
import withStyles from '../../decorators/withStyles'
import modalStyle from './InfoModal.css'

class InfoModal extends React.Component {
  static propTypes = {
    data: T.object.isRequired,
    role: T.string.isRequired,
  }

  state = {
    copied: false,
  }

  onCopy = (_, success) => {
    if (success) {
      this.setState({ copied: true })
    }
  }

  render() {
    const { username, password } = this.props.data
    const value = `${i18n.t('auth.username')}:${username} ${i18n.t('auth.password')}:${password}`
    return (
      <div style={{ paddingTop: 10 }}>
        {i18n.t('profile.copy_new_profile_information', { role: this.props.role })}
        <div className="agent-info">
          <div>{i18n.t('auth.username')}: <span className="monospace">{username}</span></div>
          <div>{i18n.t('auth.password')}: <span className="monospace">{password}</span></div>
          <CopyToClipboard text={value} onCopy={this.onCopy}>
            <Button style={{ marginTop: 20 }}><Icon type="copy" /> {i18n.t('actions.copy')}</Button>
          </CopyToClipboard>
          <span style={{ marginLeft: 20 }}>{ this.state.copied ? i18n.t('actions.copied') : '' }</span>
        </div>
      </div>
    )
  }
}

const show = ({ title, data, role, onOk }) => {
  Modal.success({
    width: 500,
    title,
    content: <InfoModal data={data} role={role || i18n.t('agent.name')} />,
    okText: i18n.t('actions.close'),
    onOk,
  })
}

const create = () =>
  ComposedComponent => withStyles(modalStyle)(ComposedComponent)

export default {
  show,
  create,
}
