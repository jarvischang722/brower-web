import React from 'react'
import T from 'prop-types'
import { connect } from 'react-redux'
import { Icon, Tag, Input, Tooltip } from 'antd'
import { KeywordActions } from '../../actions'
import { promiseTypeSuffixes } from '../../actions/lib/actionTypes'

@connect(
  null,
  {
    update: KeywordActions.actions.update,
    deleteKeyword: KeywordActions.actions.deleteKeyword
  }
)
export default class KeywordColumn extends React.Component {
  static propTypes = {
    userid: T.number.isRequired,
    keywords: T.array,
    update: T.func.isRequired
  }

  static defaultProps = {
    keywords: []
  }

  state = {
    inputVisible: false,
    inputValue: '',
    keywords: []
  }

  componentWillMount() {
    const { keywords } = this.props
    this.setState({ keywords })
  }

  handleInputChange = e => {
    this.setState({ inputValue: e.target.value })
  }

  handleInputConfirm = () => {
    const { inputValue } = this.state
    if (inputValue !== '') {
      this.addKeyword(inputValue)
    }
    this.setState({
      inputVisible: false,
      inputValue: ''
    })
  }

  showInput = () => {
    this.setState({ inputVisible: true }, () => this.input.focus())
  }

  addKeyword(keyword) {
    const { keywords } = this.state
    const { userid, update } = this.props
    update({ keyword, userid }).then(response => {
      const insertId = response.insertId
      console.log(response)
      if (insertId) {
        this.setState({ keywords: [...keywords, { id: insertId, keyword, userid }] })
      }
    })
  }

  handleClose(tagId) {
    const keywordsOfDel = [tagId]
    const { deleteKeyword } = this.props
    deleteKeyword({ keywordList: keywordsOfDel }).then(response => {
      console.log(response)
    })
  }

  saveInputRef = input => (this.input = input)

  render() {
    const { inputVisible, inputValue, keywords } = this.state
    let content = []
    if (keywords) {
      content = keywords.map(k => {
        const tag = k.keyword
        const keyId = k.id
        const isLongTag = tag.length > 10
        const tagElem = (
          <Tag closable key={tag} afterClose={() => this.handleClose(keyId)} color="blue">
            {isLongTag ? `${tag.slice(0, 10)}...` : tag}
          </Tag>
        )
        return isLongTag ? (
          <Tooltip title={tag} key={tag}>
            {' '}
            {tagElem}{' '}
          </Tooltip>
        ) : (
          tagElem
        )
      })
    }
    content.push(
      inputVisible && (
        <Input
          ref={this.saveInputRef}
          type="text"
          size="small"
          style={{ width: 78 }}
          value={inputValue}
          onChange={this.handleInputChange}
          onBlur={this.handleInputConfirm}
          onPressEnter={this.handleInputConfirm} />
      )
    )
    content.push(
      !inputVisible && (
        <Tag
          onClick={this.showInput}
          key={Math.random()}
          style={{ background: '#fff', borderStyle: 'dashed' }}>
          <Icon type="plus" /> New Tag
        </Tag>
      )
    )
    return content
  }
}
