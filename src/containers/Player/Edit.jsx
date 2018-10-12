import React from 'react'
import { Modal, Row, Col, DatePicker, Icon, Switch, message } from 'antd'
import moment from 'moment'
import T from 'prop-types'
import { connect } from 'react-redux'
import { PlayerActions } from '../../actions'
import { TagInput } from '../../components'

@connect(
  null,
  {
    updateSta: PlayerActions.actions.updateSta
  }
)
export default class Edit extends React.Component {
  state = { visible: false, player: {} }

  static propTypes = {
    player: T.object.isRequired,
    updateSta: T.func.isRequired,
    loadData: T.func.isRequired
  }

  showModal = () => {
    const player = this.props.player
    player.playerId = player.id
    this.setState({
      visible: true,
      player
    })
  }

  hideModal = () => {
    this.setState({
      visible: false,
      player: {}
    })
  }

  onSwitchChange(checked) {
    const player = this.state.player
    player.status = checked ? '1' : '0'
    this.setState({ player })
  }

  onDatePickerChange(date, dateString) {
    const player = this.state.player
    player.disable_expire = dateString
    this.setState({ player })
  }

  doSave() {
    const { id: playerId, status, disable_expire: disableExpire } = this.state.player
    const postData = { playerId, status, disableExpire }
    postData.disableExpire = status === '1' ? null : disableExpire

    this.props.updateSta(postData).then(response => {
      if (response) {
        this.props.loadData()
        this.hideModal()
      } else {
        message.error('Error')
        console.error(response)
      }
    })
  }

  render() {
    const dateFormat = 'YYYY/MM/DD'
    const { player } = this.state
    return (
      <div>
        <a onClick={this.showModal}>Edit</a>
        <Modal
          title={player.name}
          visible={this.state.visible}
          onOk={this.doSave.bind(this)}
          onCancel={this.hideModal}
          okText="Save"
          cancelText="Cancel">
          <Row gutter={16}>
            <Col span={12}> Status</Col>
            <Col span={12}>
              <Switch
                onChange={this.onSwitchChange.bind(this)}
                checkedChildren={<Icon type="check" />}
                unCheckedChildren={<Icon type="close" />}
                defaultChecked={player.status === '1'} />
            </Col>
          </Row>
          <br />
          <Row gutter={16}>
            <Col span={12} offset="right">
              {' '}
              Disabled expire
            </Col>
            <Col span={12}>
              <DatePicker
                format={dateFormat}
                disabled={player.status === '1'}
                disabledDate={current => current && current < moment().endOf('day')}
                defaultValue={player.disable_expire ? moment(player.disable_expire) : ''}
                onChange={this.onDatePickerChange.bind(this)} />
            </Col>
          </Row>
        </Modal>
      </div>
    )
  }
}
