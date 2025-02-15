import url from 'url'
import React from 'react'
import T from 'prop-types'
import { Table, Icon } from 'antd'
import api from '../../utils/api'

const generateLogoUrl = (logo) => {
  if (!logo) return ''
  if (logo.indexOf('http') === 0) return logo
  return `${url.resolve(api.basename, logo)}`
}

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
        <h4 style={{ display: 'inline' }}>{i18n.t('list.all', { type: i18n.t('short_link.title'), total: this.props.pagination.total })}</h4>
        {this.renderReloadButton()}
      </div>
    )

  getColumns = () => {
    const columns = {
      image: {
        title: '', dataIndex: 'logo_url', width: 70,
        render: (logo) =>
          (
            logo ?
              <img src={generateLogoUrl(logo)} style={{ width: 50, height: 50, margin: '-10px 0' }} alt="" /> :
              <div style={{ width: 50, height: 50, margin: '-10px 0', display: 'block', backgroundColor: '#f0f0f0', borderRadius: 5 }} />
          )
      },
      site_name: {
        title: i18n.t('short_link.site_name'), dataIndex: 'site_name',
        render: (name) => name || <i style={{ color: '#ccc' }}>{i18n.t('none')}</i>
      },
      long: {
        title: i18n.t('short_link.long'), dataIndex: 'long'
      },
      short: {
        title: i18n.t('short_link.short'), dataIndex: 'short'
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
