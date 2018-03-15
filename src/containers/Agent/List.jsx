import React from 'react'
import T from 'prop-types'
import update from 'immutability-helper'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import { AgentActions } from '../../actions'
import { Section } from '../../components'
import ListControl from './ListControl'

@connect(
  ({ user, agents }) => {
    const { data, status } = agents
    return {
      user: user.data || {},
      agents: data || {},
      status,
      query: (data && data.params) || {}
    }
  },
  {
    getAgents: AgentActions.actions.list,
  }
)
export default class List extends React.Component {
  static propTypes = {
    location: T.object.isRequired,
    user: T.object.isRequired,
    agents: T.object.isRequired,
    getAgents: T.func.isRequired,
    status: T.string.isRequired,
    query: T.object.isRequired,
  }

  static contextTypes = {
    router: T.object.isRequired,
  }

  state = {
    pagination: {
      pageSize: 10,
      total: this.props.agents.total || 0,
      current: 1,
      showSizeChanger: true,
    },
    filters: {},
  }

  componentWillMount() {
    const { location, query } = this.props
    this.state.pagination.current = (location.action === 'POP' && query.page) || 1
  }

  componentDidMount() {
    if (this.props.user.role !== 1) {
      this.context.router.replace('/browser')
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
    this.props.getAgents(pagination, filters)
      .then(({ error }) => {
        if (!error) {
          if (this.mounted) {
            this.setState({
              pagination: update(pagination, { total: { $set: this.props.agents.total } }),
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

  getActionsColumn = () => (
    {
      title: i18n.t('actions.title'), key: 'actions', width: 200, className: 'align-center',
      render: ({ id }) => {
        const actions = []
        actions.push(
          <Link to={`/agents/${id}`}>{i18n.t('actions.edit')}</Link>
        )
        return actions
      }
    }
  )

  getColumns = () => {
    const columns = ['username & name', 'role']
    columns.push(this.getActionsColumn())
    return columns
  }

  render() {
    const { user, agents, status } = this.props
    if (user.role !== 1) return null
    return (
      <Section noline compress>
        <Link to="/agents/new" className="stext">
          <i className="sicon icon-add-circle" /> {i18n.t('actions.add')}
        </Link>
        <ListControl
          columns={this.getColumns()}
          dataSource={agents.items}
          pagination={this.state.pagination}
          loading={status === 'LOADING'}
          onChange={this.handleTableChange} />
      </Section>
    )
  }
}
