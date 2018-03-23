import React from 'react'
import T from 'prop-types'
import { connect } from 'react-redux'
import { Loading, Section } from '../../components'
import Editor from './Editor'
import { ShortLinkActions } from '../../actions'

@connect(
  null,
  {
    get: ShortLinkActions.actions.get,
    save: ShortLinkActions.actions.update,
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
            this.setState(state)
          }
        }
      )
  }

  endEdit = () => {
    this.context.router.push('/shorts')
  }

  render() {
    const { initialValues } = this.state
    if (!initialValues) return <Loading />
    return (
      <Section title={i18n.t('actions.edit+short_link.name').toUpperCase()}>
        <Editor
          {...this.props}
          initialValues={initialValues}
          onEndEditing={this.endEdit} />
      </Section>
    )
  }
}
