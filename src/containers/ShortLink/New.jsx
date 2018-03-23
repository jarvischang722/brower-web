import React from 'react'
import T from 'prop-types'
import { connect } from 'react-redux'
import { Section } from '../../components'
import Editor from './Editor'
import { ShortLinkActions } from '../../actions'

@connect(
  null,
  {
    save: ShortLinkActions.actions.create,
  }
)
export default class New extends React.PureComponent {
  static contextTypes = {
    router: T.object.isRequired,
  }

  endEdit = () => {
    this.context.router.push('/shorts')
  }

  render() {
    return (
      <Section title={i18n.t('agent.add+short_link.name').toUpperCase()}>
        <Editor
          {...this.props}
          onEndEditing={this.endEdit} />
      </Section>
    )
  }
}
