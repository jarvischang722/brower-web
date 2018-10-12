import React from 'react'
import { Modal, Row, Col, message } from 'antd'
import T from 'prop-types'
import { connect } from 'react-redux'
import { BlackWhiteActions } from '../../actions'
import { TagInput } from '../../components'
import ip from 'ip'

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
    const postData = this.preCheckPostData({ userid, whiteList, blackList })
    if (postData === null) {
      return
    }
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

  preCheckPostData(afterData) {
    const postData = afterData
    const listType = ['blackList', 'whiteList']
    let isValid = true
    for (let tIdx = 0; tIdx < listType.length; tIdx++) {
      const type = listType[tIdx]
      let list = postData[type]
      if (!Array.isArray(list)) {
        list = list.split(',').filter(val => val !== '')
      }
      postData[type] = list.join(',')
      if (list.length > 0 && !this.checkIpFormat(list)) {
        message.error(`please check [${type} ] ip format`)
        isValid = false
        break
      }
    }

    if (!isValid) return null

    return postData
  }

  checkIpFormat(list) {
    let isV4Format = true
    if (list.length > 0) {
      for (let idx = 0; idx < list.length; idx++) {
        const theIP = list[idx]
        if (!ip.isV4Format(theIP.split('/')[0])) {
          isV4Format = false
          break
        }
      }
    }
    return isV4Format
  }

  onChangeBlackList(value) {
    const agent = this.state.agent
    agent.black_list =
      value !== null && Array.isArray(value) ? value.map(d => d.value).join(',') : agent.black_list
    this.setState({ agent })
  }

  onChangeWhiteList(value) {
    const agent = this.state.agent
    agent.white_list =
      value !== null && Array.isArray(value) ? value.map(d => d.value).join(',') : agent.black_list
    this.setState({ agent })
  }

  onCloseBlackList(items) {
    const agent = this.state.agent
    agent.black_list = items
    this.setState({ agent })
  }

  onCloseWhiteList(items) {
    const agent = this.state.agent
    agent.white_list = items
    this.setState({ agent })
  }

  render() {
    const { agent } = this.state
    return (
      <div>
        <a onClick={this.showModal}>Edit</a>
        <Modal
          maskClosable={false}
          title={agent.name}
          visible={this.state.visible}
          onOk={this.doSave.bind(this)}
          onCancel={this.hideModal}
          okText="Save"
          cancelText="Cancel">
          <Row gutter={16}>
            <Col span={4}>Black List</Col>
            <Col span={12}>
              <TagInput items={agent.black_list} onChange={this.onChangeBlackList.bind(this)} onClose={this.onCloseBlackList.bind(this)} />
            </Col>
          </Row>
          <br />
          <Row gutter={16}>
            <Col span={4}>White List</Col>
            <Col span={12}>
              <TagInput items={agent.white_list} onChange={this.onChangeWhiteList.bind(this)} onClose={this.onCloseWhiteList.bind(this)} />
            </Col>
          </Row>
        </Modal>
      </div>
    )
  }
}

export default Edit
