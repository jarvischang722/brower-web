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

  openDeleteConfirm = () => {
    const { username } = this.props
    Modal.confirm({
      title: 'Delete',
      icon: 'delete',
      iconType: 'delete',
      onOk: this.deleteAgent,
      onCancel: this.hideConfirm,
      content: i18n.t('agent.message.delete.confirm', { username }),
      okText: i18n.t('actions.confirm'),
      cancelText: i18n.t('actions.cancel'),
      maskClosable: false
    })
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
    return (
      <a onClick={this.openDeleteConfirm} style={delOfStyle}>
        <Icon type="delete" /> {i18n.t('actions.remove')}
      </a>
    )
  }
}
