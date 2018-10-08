import React from 'react'
import moment from 'moment'
import T from 'prop-types'
import { Table, Icon, Switch, DatePicker } from 'antd'

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
        {i18n.t('list.all', { type: i18n.t('player.title'), total: this.props.pagination.total })}
      </h4>
      {this.renderReloadButton()}
    </div>
  )

  getColumns = () => {
    const columns = {
      username: {
        title: 'username',
        dataIndex: 'username',
        render: name => name || <i style={{ color: '#ccc' }}>{i18n.t('none')}</i>
      },
      name: {
        title: 'name',
        dataIndex: 'name',
        render: name => name || <i style={{ color: '#ccc' }}>{i18n.t('none')}</i>
      },
      status: {
        title: 'status',
        dataIndex: 'status',
        render: (status, row) =>
          status === '1' ? (
            <Icon type="check-circle" theme="twoTone" style={{ fontSize: '30px', color: '#17e017' }} />
          ) : (
            <Icon type="close-circle" theme="twoTone" style={{ fontSize: '30px', color: 'red' }} />
          )
      },
      disable_expire: {
        title: 'disable expire',
        dataIndex: 'disable_expire',
        render: (date, row) => date ? moment(date).format('YYYY/MM/DD') : 'N/A'
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
