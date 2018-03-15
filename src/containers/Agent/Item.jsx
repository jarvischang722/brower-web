import url from 'url'
import React from 'react'
import T from 'prop-types'
import { connect } from 'react-redux'
import { Loading, Section } from '../../components'
import Editor from './Editor'
import { AgentActions } from '../../actions'
import api from '../../utils/api'

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

  static contextTypes = {
    router: T.object.isRequired,
  }

  state = {}

  componentWillMount() {
    this.loadData()
  }

  loadData() {
    const { params, get } = this.props
    get(params.id)
      .then(
        (response) => {
          if (!response.error) {
            const state = { initialValues: response }
            state.iconUrl = this.generateIconUrl(response.icon)
            this.setState(state)
          }
        }
      )
  }

  endEdit = () => {
    this.context.router.push('/agents')
  }

  generateIconUrl = (icon) => {
    if (!icon) return ''
    return `${url.resolve(api.basename, icon)}?t=${Date.now()}`
  }

  render() {
    const { initialValues } = this.state
    if (!initialValues) return <Loading />
    return (
      <Section title={i18n.t('agent.name+agent.profile').toUpperCase()}>
        <Editor
          {...this.props}
          initialValues={initialValues}
          iconPreview={this.state.iconUrl}
          onEndEditing={this.endEdit} />
      </Section>
    )
  }
}
