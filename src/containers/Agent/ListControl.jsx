import React from 'react'
import T from 'prop-types'
import { Table, Icon } from 'antd'
import moment from 'moment'
import { roles } from '../../constant'

export default class ListControl extends React.Component {
  static propTypes = {
    dataSource: T.array,
    onChange: T.func.isRequired,
    loading: T.bool.isRequired,
    pagination: T.object.isRequired,
    columns: T.array.isRequired,
  }

  static defaultProps = {
    dataSource: null,
  }

  reload = () => {
    this.onChange({ current: 1 })
  }

  onChange = (pagination = this.props.pagination) => {
    this.props.onChange(pagination)
  }

  getTitle = () =>
    (
      <div>
        <h4 style={{ display: 'inline' }}>{i18n.t('list.all', { type: i18n.t('agent.title'), total: this.props.pagination.total })}</h4>
        {this.renderReloadButton()}
      </div>
    )

  getColumns = () => {
    const columns = {
      'username & name': {
        title: `${i18n.t('profile.name')} / ${i18n.t('auth.username')}`, key: 'username & name', width: '240',
        render: ({ username, name }) =>
          (
            <span>
              <b style={{ marginRight: 12 }}>{name}</b>
              <span style={{ marginRight: 12 }}>/</span>
              <i>{username}</i>
            </span>
          )
      },
      role: {
        title: i18n.t('profile.role'), dataIndex: 'role', className: 'monospace',
        render: (role) => roles.find(({ value }) => value === role).text
      },
      expireIn: {
        title: i18n.t('profile.expire_in'), dataIndex: 'expireIn', width: 100, className: 'monospace nowrap',
        render: (time) => time ? moment(time * 1000).format('YYYY-MM-DD HH:mm') : '-'
      },
    }
    const result = []
    this.props.columns.forEach((item) => {
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

  renderResetButton = () =>
    (
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

  renderReloadButton = () =>
    (
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
