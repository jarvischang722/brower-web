import React from 'react'
import T from 'prop-types'
import { connect } from 'react-redux'
import { Icon, Button, Modal } from 'antd'
import { UserActions } from '../../actions'

@connect(
  null,
  {
    delete: UserActions.actions.delete
  }
)
export default class Profile extends React.Component {
  static propTypes = {
    id: T.number.isRequired,
    username: T.string.isRequired,
    delete: T.func.isRequired,
    loadData: T.func.isRequired
  }

  state = {
    confirmVisible: false
  }

  confirmDelete = () => {
    this.setState({ confirmVisible: true })
  }

  hideConfirm = () => {
    this.setState({ confirmVisible: false })
  }

  deleteAgent = () => {
    const id = this.props.id
    const postData = { id }
    this.props.delete(postData).then(response => {
      if (response.isDeleted) {
        this.hideConfirm()
        this.props.loadData()
      }
    })
  }

  render() {
    const delOfStyle = {
      color: 'red',
      paddingLeft: '10px'
    }
    const { username } = this.props
    return (
      <div>
        <a onClick={this.confirmDelete} style={delOfStyle}>
          <Icon type="delete" /> {i18n.t('actions.remove')}
        </a>
        <Modal
          title="Delete"
          visible={this.state.confirmVisible}
          onOk={this.deleteAgent}
          onCancel={this.hideConfirm}
          maskClosable={false}
          okText={i18n.t('actions.confirm')}
          cancelText={i18n.t('actions.cancel')}>
          <p>{i18n.t('agent.message.delete.confirm', { username })}</p>
        </Modal>
      </div>
    )
  }
}
