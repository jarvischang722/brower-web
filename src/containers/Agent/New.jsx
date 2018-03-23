import React from 'react'
import T from 'prop-types'
import { connect } from 'react-redux'
import { Section } from '../../components'
import Editor from './Editor'
import { AgentActions } from '../../actions'
import InfoModal from './InfoModal'

@connect(
  null,
  {
    save: AgentActions.actions.create,
  }
)
@InfoModal.create()
export default class New extends React.PureComponent {
  static contextTypes = {
    router: T.object.isRequired,
  }

  exit = () => {
    setTimeout(() => {
      this.context.router.push('/agents')
    }, 400)
  }

  endEdit = (data) => {
    if (data) {
      InfoModal.show({
        title: i18n.t('agent.message.success.create', { name: data.name }),
        data,
        onOk: this.exit
      })
    } else {
      this.context.router.push('/agents')
    }
  }

  render() {
    return (
      <Section title={i18n.t('agent.create+agent.name').toUpperCase()}>
        <Editor
          {...this.props}
          initialValues={{ role: 1 }}
          onEndEditing={this.endEdit} />
      </Section>
    )
  }
}
