import url from 'url'
import React from 'react'
import T from 'prop-types'
import { connect } from 'react-redux'
import { Loading, Section } from '../../components'
import BrowserSettingForm from './BrowserSettingForm'
import BrowserVersions from './BrowserVerions'
import { AgentActions, BrowserActions } from '../../actions'
import api from '../../utils/api'

@connect(
  null,
  {
    get: AgentActions.actions.get,
    save: AgentActions.actions.update,
    getBrowserList: BrowserActions.actions.list,
    createBrowserVersion: BrowserActions.actions.create,
    generateWindowsBrowser: BrowserActions.actions.generateWindowsBrowser
  }
)
export default class CreateBrowser extends React.PureComponent {
  static propTypes = {
    params: T.object.isRequired,
    get: T.func.isRequired,
    getBrowserList: T.func.isRequired,
    createBrowserVersion: T.func.isRequired,
    generateWindowsBrowser: T.func.isRequired,
  }

  static contextTypes = {
    router: T.object.isRequired,
  }

  state = {
    editable: false
  }

  componentDidMount() {
    this.loadSettingData()
  }

  loadSettingData() {
    const { params, get } = this.props
    get(params.id)
      .then(
        (response) => {
          if (!response.error) {
            const state = { initialValues: response }
            state.iconUrl = this.generateIconUrl(response.icon)
            if (!response.icon) state.editable = true
            this.setState(state)
            if (response.icon) this.loadBrowserList()
          }
        }
      )
  }

  loadBrowserList() {
    const { params, getBrowserList } = this.props
    getBrowserList(params.id)
      .then(
        response => {
          if (!response.error) {
            const state = { browsers: {} }
            if (response.total > 0) {
              let shouldReload = false
              response.items.forEach(item => {
                state.browsers[item.platform] = item
                if (item.status === 2) shouldReload = true
              })
              if (shouldReload) setTimeout(() => { this.loadBrowserList() }, 10000)
            }
            this.setState(state)
          }
        }
      )
  }

  browserSettingSaved = (response, newIcon) => {
    const state = { editable: false }
    if (newIcon) state.iconUrl = this.generateIconUrl(response.icon)
    state.initialValues = { ...this.state.initialValues, ...response }
    this.setState(state)
    this.loadBrowserList()
  }

  onCancel = () => {
    this.context.router.push('/agents')
  }

  onUpdateState = (editable) => {
    this.setState({ editable })
  }

  generateIconUrl = (icon) => {
    if (!icon) return ''
    return `${url.resolve(api.basename, icon)}?t=${Date.now()}`
  }

  versionsShouldChange = () => {
    this.loadBrowserList()
  }

  render() {
    const { initialValues, editable, browsers } = this.state
    if (!initialValues) return <Loading />
    return (
      <Section title={i18n.t('actions.manage+browser.title').toUpperCase()}>
        <BrowserSettingForm
          {...this.props}
          initialValues={initialValues}
          iconPreview={this.state.iconUrl}
          onSave={this.browserSettingSaved}
          onCancel={this.onCancel}
          onUpdateState={this.onUpdateState}
          editable={editable} />
        {
          !editable &&
          <BrowserVersions
            {...this.props}
            data={browsers}
            handleChange={this.versionsShouldChange} />
        }
      </Section>
    )
  }
}
