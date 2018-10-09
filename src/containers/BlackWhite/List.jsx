import React from 'react'
import T from 'prop-types'
import update from 'immutability-helper'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import { Button } from 'antd'
import { BlackWhiteActions } from '../../actions'
import { Section } from '../../components'
import ListControl from './ListControl'

@connect(
  ({ user, blackWhite }) => {
    const { data, status } = blackWhite
    return {
      user: user.data || {},
      blackWhite: data || {},
      status,
      query: (data && data.params) || {}
    }
  },
  {
    list: BlackWhiteActions.actions.list
  }
)
export default class List extends React.Component {
  static propTypes = {
    location: T.object.isRequired,
    user: T.object.isRequired,
    blackWhite: T.object.isRequired,
    list: T.func.isRequired,
    status: T.string.isRequired,
    query: T.object.isRequired
  }

  static contextTypes = {
    router: T.object.isRequired
  }

  state = {
    pagination: {
      pageSize: 10,
      total: this.props.blackWhite.total || 0,
      current: 1,
      showSizeChanger: true
    },
    filters: {}
  }

  componentWillMount() {
    const { location, query } = this.props
    this.state.pagination.current = (location.action === 'POP' && query.page) || 1
  }

  componentDidMount() {
    if (this.props.user.role !== 1) {
      this.context.router.replace('/')
    } else {
      this.loadData()
      this.mounted = true
    }
  }

  componentWillUnmount() {
    this.mounted = false
  }

  loadData = () => {
    const { pagination, filters } = this.state
    this.props.list(pagination, filters).then(({ error }) => {
      if (!error) {
        if (this.mounted) {
          this.setState({
            pagination: update(pagination, { total: { $set: this.props.blackWhite.total } })
          })
        }
      }
    })
  }

  handleTableChange = (pager, filters) => {
    const { pagination } = this.state
    pagination.current = pager.current
    pagination.pageSize = pager.pageSize || 10
    this.state.filters = filters
    this.loadData()
  }

  getActionsColumn = () => ({
    title: i18n.t('actions.title'),
    key: 'actions',
    width: 200,
    className: 'align-center',
    render: ({ id }) => {
      const actions = []
      actions.push(<Link to={`/blackWhite/${id}`}>{i18n.t('actions.edit')}</Link>)
      return actions
    }
  })

  getColumns = () => {
    const columns = ['name', 'black_list', 'white_list']
    columns.push(this.getActionsColumn())
    return columns
  }

  goCreate = () => {
    this.context.router.push('/blackWhite/new')
  }

  render() {
    const { user, blackWhite, status } = this.props
    if (user.role !== 1) return null
    return (
      <Section noline compress>
        <Button type="primary" size="large" className="stext" onClick={this.goCreate}>
          <i className="sicon icon-add-circle" /> {i18n.t('actions.add + black_white_list.name')}
        </Button>
        <ListControl
          columns={this.getColumns()}
          dataSource={blackWhite.items}
          pagination={this.state.pagination}
          loading={status === 'LOADING'}
          onChange={this.handleTableChange} />
      </Section>
    )
  }
}
