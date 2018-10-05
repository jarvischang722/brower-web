import React from 'react'
import T from 'prop-types'
import update from 'immutability-helper'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import { Button } from 'antd'
import { KeywordActions } from '../../actions'
import { Section } from '../../components'
import ListControl from './ListControl'

@connect(
  ({ user, keyword }) => {
    const { data, status } = keyword
    return {
      user: user.data || {},
      keyword: data || {},
      status,
      query: (data && data.params) || {}
    }
  },
  {
    list: KeywordActions.actions.list
  }
)
export default class List extends React.Component {
  static propTypes = {
    location: T.object.isRequired,
    user: T.object.isRequired,
    keyword: T.object.isRequired,
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
      total: this.props.keyword.total || 0,
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
            pagination: update(pagination, { total: { $set: this.props.keyword.total } })
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

  getColumns = () => {
    const columns = ['name', 'keywords']
    return columns
  }

  render() {
    const { user, keyword, status } = this.props
    if (user.role !== 1) return null
    return (
      <Section noline compress>
        <ListControl
          columns={this.getColumns()}
          dataSource={keyword.items}
          pagination={this.state.pagination}
          loading={status === 'LOADING'}
          onChange={this.handleTableChange} />
      </Section>
    )
  }
}
