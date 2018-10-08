import React from 'react'
import { Modal, Row, Col, DatePicker, Icon, Switch } from 'antd'
import moment from 'moment'
import T from 'prop-types'
import { connect } from 'react-redux'
import { PlayerActions } from '../../actions'

@connect(
  null,
  {
    detail: PlayerActions.actions.detail,
    update: PlayerActions.actions.update
  }
)
export default class Edit extends React.Component {
  state = { visible: false, datePickerDisable: false, player: {} }

  static propTypes = {
    player: T.object.isRequired
  }

  ComponentWillMount() {
    this.setState({ player: this.props.player })
  }

  showModal = () => {
    this.setState({
      visible: true
    })
  }

  hideModal = () => {
    this.setState({
      visible: false
    })
  }

  onSwitchChange(checked) {
    this.setState({ player: { status: checked } })
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
          onOk={this.hideModal}
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
          <Row gutter={16}>
            <Col span={12}> Disabled expire</Col>
            <Col span={12}>
              <DatePicker
                format={dateFormat}
                disabled
                disabledDate={current => current && current < moment().endOf('day')}
                defaultValue={player.disable_expire ? moment(player.disable_expire) : ''} />
            </Col>
          </Row>
        </Modal>
      </div>
    )
  }
}
