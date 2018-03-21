import React from 'react'
import T from 'prop-types'
import update from 'immutability-helper'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import { Icon, Button } from 'antd'
import { AgentActions } from '../../actions'
import { Section } from '../../components'
import ListControl from './ListControl'
import NewAgentModal from './NewAgentModal'

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
    create: AgentActions.actions.create
  }
)
export default class List extends React.Component {
  static propTypes = {
    location: T.object.isRequired,
    user: T.object.isRequired,
    agents: T.object.isRequired,
    getAgents: T.func.isRequired,
    create: T.func.isRequired,
    status: T.string.isRequired,
    query: T.object.isRequired,
  }

  static contextTypes = {
    router: T.object.isRequired,
  }

  state = {
    newAgentModalVisible: false,
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
          <Link to={`/agents/${id}/browser`}>
            <Icon type="ie" /> {i18n.t('actions.manage+browser.title')}
          </Link>
        )
        return actions
      }
    }
  )

  getColumns = () => {
    const columns = ['username & name']
    columns.push(this.getActionsColumn())
    return columns
  }

  showNewAgentModal = () => {
    this.setState({ newAgentModalVisible: true })
  }

  closeNewAgentModal = (newAgentId) => {
    this.setState({ newAgentModalVisible: false })
    if (newAgentId) {
      this.context.router.push(`/agents/${newAgentId}/browser`)
    }
  }

  render() {
    const { user, agents, status } = this.props
    if (user.role !== 1) return null
    return (
      <Section noline compress>
        <Button type="primary" size="large" className="stext" onClick={this.showNewAgentModal}>
          <i className="sicon icon-add-circle" /> {i18n.t('actions.create+role.agent')}
        </Button>
        <ListControl
          columns={this.getColumns()}
          dataSource={agents.items}
          pagination={this.state.pagination}
          loading={status === 'LOADING'}
          onChange={this.handleTableChange} />
        {
          this.state.newAgentModalVisible &&
          <NewAgentModal save={this.props.create} close={this.closeNewAgentModal} />
        }
      </Section>
    )
  }
}
