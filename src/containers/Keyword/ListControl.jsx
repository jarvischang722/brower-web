import url from 'url'
import React from 'react'
import T from 'prop-types'
import { Table, Icon, Tag, Input, Tooltip } from 'antd'
import api from '../../utils/api'

export default class ListControl extends React.Component {
  static propTypes = {
    dataSource: T.array,
    onChange: T.func.isRequired,
    loading: T.bool.isRequired,
    pagination: T.object.isRequired,
    columns: T.array.isRequired
  }

  static defaultProps = {
    dataSource: null
  }

  state = {
    inputVisible: false,
    inputValue: ''
  }

  reload = () => {
    this.onChange({ current: 1 })
  }

  onChange = (pagination = this.props.pagination) => {
    this.props.onChange(pagination)
  }

  getTitle = () => (
    <div>
      <h4 style={{ display: 'inline' }}>
        {i18n.t('list.all', { type: i18n.t('keyword.title'), total: this.props.pagination.total })}
      </h4>
      {this.renderReloadButton()}
    </div>
  )

  showInput = () => {
    this.setState({ inputVisible: true }, () => this.input.focus())
  }

  handleInputChange = e => {
    this.setState({ inputValue: e.target.value })
  }

  handleInputConfirm = () => {
    const { inputValue } = this.state
    console.log('inputValue : ', inputValue)
    this.setState({
      inputVisible: false,
      inputValue: ''
    })
  }

  getColumns = () => {
    const columns = {
      name: {
        title: 'name',
        dataIndex: 'name',
        render: name => name || <i style={{ color: '#ccc' }}>{i18n.t('none')}</i>
      },
      keywords: {
        title: 'keywords',
        dataIndex: 'keywords',
        render: this.renderKeywordColumn
      }
    }
    const result = []
    this.props.columns.forEach(item => {
      if (typeof item === 'string') {
        const column = columns[item]
        if (column) {
          result.push(column)
        }
      } else if (item.dataIndex || item.key || item.render) {
        result.push(item)
      }
    })
    return result
  }

  renderKeywordColumn = (kws) => {
    const { inputVisible, inputValue } = this.state
    let content = []
    if (kws) {
      content = kws.map(k => {
        const tag = k.keyword
        const isLongTag = tag.length > 10
        const tagElem = (
          <Tag title={tag} closable key={tag} color="blue">
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
        <Tag onClick={this.showInput} style={{ background: '#fff', borderStyle: 'dashed' }}>
          <Icon type="plus" /> New Tag
        </Tag>
      )
    )
    return content
  }

  renderResetButton = () => (
    <a
      style={{ marginLeft: 20, display: 'inline' }}
      type="primary"
      size="large"
      onClick={this.resetAll}
      tabIndex={-1}
      role="button">
      {i18n.t('actions.get_all')}
    </a>
  )

  renderReloadButton = () => (
    <a
      style={{ marginLeft: 20, display: 'inline' }}
      type="primary"
      size="large"
      onClick={this.reload}
      tabIndex={-1}
      role="button">
      <Icon type="reload" style={{ marginRight: 5 }} />
      {i18n.t('actions.reload')}
    </a>
  )

  saveInputRef = input => (this.input = input)

  render() {
    const { dataSource, pagination, loading } = this.props
    return (
      <Table
        rowKey="id"
        title={this.getTitle}
        columns={this.getColumns()}
        dataSource={dataSource}
        pagination={pagination}
        loading={loading}
        onChange={this.onChange} />
    )
  }
}
