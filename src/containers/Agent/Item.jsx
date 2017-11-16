import React from 'react'
import T from 'prop-types'
import { connect } from 'react-redux'
import { Loading, Section } from '../../components'
import Editor from '../Profile/Editor'
import { AgentActions } from '../../actions'

@connect(
  null,
  {
    get: AgentActions.actions.get,
    save: AgentActions.actions.update,
  }
)
export default class Item extends React.PureComponent {
  static propTypes = {
    params: T.object.isRequired,
    get: T.func.isRequired,
  }

  state = {}

  componentWillMount() {
    this.loadData()
  }

  initializeValues(data) {
    this.setState({ initialValues: data })
  }

  loadData() {
    const { params, get } = this.props
    get(params.id)
      .then(
        (response) => {
          if (!response.error) this.initializeValues(response)
        }
      )
  }

  render() {
    const { initialValues } = this.state
    if (!initialValues) return <Loading />
    return (
      <Section title={i18n.t('agent.name+agent.profile').toUpperCase()}>
        <Editor {...this.props} user={initialValues} />
      </Section>
    )
  }
}
