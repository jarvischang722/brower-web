import React from 'react'
import T from 'prop-types'
import { Table, Icon } from 'antd'
import KeywordColumn from './KeywordColumn'

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


  getColumns = () => {
    const columns = {
      name: {
        title: i18n.t('profile.name'),
        dataIndex: 'name',
        render: name => name || <i style={{ color: '#ccc' }}>{i18n.t('none')}</i>
      },
      keywords: {
        title: i18n.t('keyword.title'),
        dataIndex: 'keywords',
        render: (keywords, row) => <KeywordColumn keywords={keywords} userid={row.id} />
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
