import React from 'react'
import { Modal, Row, Col, message } from 'antd'
import T from 'prop-types'
import { connect } from 'react-redux'
import { BlackWhiteActions } from '../../actions'
import { TagInput } from '../../components'

@connect(
  null,
  {
    update: BlackWhiteActions.actions.update
  }
)
class Edit extends React.Component {
  static propTypes = {
    agent: T.object.isRequired,
    update: T.func.isRequired,
    loadData: T.func.isRequired
  }
  constructor(props) {
    super(props)

    this.state = { visible: false, agent: {} }
    this.onChangeBlackList = this.onChangeBlackList.bind(this)
    this.onChangeWhiteList = this.onChangeWhiteList.bind(this)
    this.doSave = this.doSave.bind(this)
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
    const { loadData } = this.props
    if (Array.isArray(postData.blackList)) {
      postData.blackList = postData.blackList.map((d) => d.value).join(',')
    }
    if (Array.isArray(postData.whiteList)) {
      postData.whiteList = postData.whiteList.map((d) => d.value).join(',')
    }

    this.props.update(postData).then(response => {
      if (response) {
        loadData()
        this.hideModal()
      } else {
        message.error('Error')
        console.error(response)
      }
    })
  }

  onChangeBlackList(value) {
    const agent = this.state.agent
    agent.black_list = value
    this.setState({ agent })
  }

  onChangeWhiteList(value) {
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
          onOk={this.doSave}
          onCancel={this.hideModal}
          okText="Save"
          cancelText="Cancel">
          <Row gutter={16}>
            <Col span={4}>Black List</Col>
            <Col span={12}>
              <TagInput items={agent.black_list} />
            </Col>
          </Row>
          <br />
          <Row gutter={16}>
            <Col span={4}>White List</Col>
            <Col span={12}>
              <TagInput items={agent.white_list} />
            </Col>
          </Row>
        </Modal>
      </div>
    )
  }
}

export default Edit
