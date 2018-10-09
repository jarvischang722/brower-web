import React from 'react'
import { Modal, Row, Col, Input, message } from 'antd'
import T from 'prop-types'
import { connect } from 'react-redux'
import { BlackWhiteActions } from '../../actions'

@connect(
  null,
  {
    update: BlackWhiteActions.actions.update
  }
)
export default class Edit extends React.Component {
  state = { visible: false, agent: {} }

  static propTypes = {
    agent: T.object.isRequired,
    update: T.func.isRequired,
    loadData: T.func.isRequired
  }

  showModal = () => {
    const agent = this.props.agent
    this.setState({
      visible: true,
      agent
    })
  }

  hideModal = () => {
    this.setState({
      visible: false,
      agent: {}
    })
  }


  doSave() {
    const { userid, white_list: whiteList, black_list: blackList } = this.state.agent
    const postData = { userid, whiteList, blackList }
    this.props.update(postData).then(response => {
      if (response) {
        this.props.loadData()
        this.hideModal()
      } else {
        message.error('Error')
        console.error(response)
      }
    })
  }

  onChangeBlackList(evt) {
    const value = evt.target.value
    const agent = this.state.agent
    agent.black_list = value
    this.setState({ agent })
  }

  onChangeWhiteList(evt) {
    const value = evt.target.value
    const agent = this.state.agent
    agent.white_list = value
    this.setState({ agent })
  }

  render() {
    const { agent } = this.state
    return (
      <div>
        <a onClick={this.showModal}>Edit</a>
        <Modal
          title={agent.name}
          visible={this.state.visible}
          onOk={this.doSave.bind(this)}
          onCancel={this.hideModal}
          okText="Save"
          cancelText="Cancel">
          <Row gutter={16}>
            <Col span={12}>Black List</Col>
            <Col span={12}>
              <Input value={agent.black_list} onChange={this.onChangeBlackList.bind(this)} />
            </Col>
          </Row>
          <br />
          <Row gutter={16}>
            <Col span={12}>White List</Col>
            <Col span={12}>
              <Input value={agent.white_list} onChange={this.onChangeWhiteList.bind(this)} />
            </Col>
          </Row>
        </Modal>
      </div>
    )
  }
}
