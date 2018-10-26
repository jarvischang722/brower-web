import React from 'react'
import T from 'prop-types'
import { Table, Icon, Tag } from 'antd'

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

  reload = () => {
    this.onChange({ current: 1 })
  }

  onChange = (pagination = this.props.pagination) => {
    this.props.onChange(pagination)
  }

  getTitle = () => (
    <div>
      <h4 style={{ display: 'inline' }}>
        {i18n.t('list.all', {
          type: i18n.t('black_white_list.title'),
          total: this.props.pagination.total
        })}
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
      black_list: {
        title: i18n.t('black_white_list.black'),
        dataIndex: 'black_list',
        render: this.renderListCol
      },
      white_list: {
        title: i18n.t('black_white_list.white'),
        dataIndex: 'white_list',
        render: this.renderListCol
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

  renderListCol = item => {
    if (item === '') return ''
    let list = item
    if (list !== null && typeof list === 'string') {
      list = list.split(',').map(d => <Tag>{d}</Tag>)
    }
    return list
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
