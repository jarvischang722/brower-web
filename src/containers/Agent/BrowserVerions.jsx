import React from 'react'
import T from 'prop-types'
import { connect } from 'react-redux'
import { Tag, Icon, Button, Modal } from 'antd'
import CopyToClipboard from 'react-copy-to-clipboard'
import { WrappedFormItem } from '../../components'
import { formLayout } from '../../constant'
import { MessageActions } from '../../actions'
import NewBrowserVersionModal from './NewBrowserVersionModal'

const { formItemLayout } = formLayout

const platforms = ['Windows', 'macOS', 'iOS', 'Android']

@connect(
  null,
  {
    notify: MessageActions.actions.success,
  }
)
export default class BrowserVersions extends React.Component {
  static propTypes = {
    params: T.object.isRequired,
    data: T.object,
    notify: T.func.isRequired,
    handleChange: T.func.isRequired,
    createBrowserVersion: T.func.isRequired,
    generateWindowsBrowser: T.func.isRequired,
  }

  static defaultProps = {
    data: {}
  }

  state = {
    newVersionPlatform: '',
    newVersionDefaultLink: ''
  }

  onCopy = (_, success) => {
    if (success) {
      this.props.notify(i18n.t('actions.copied'))
    }
  }

  showNewVersionModal = (platform, link) =>
    () =>
      this.setState({ newVersionPlatform: platform, newVersionDefaultLink: link })

  closeNewVersionModal = (shouldReload) => {
    this.setState({ newVersionPlatform: '', newVersionDefaultLink: '' })
    if (shouldReload) {
      this.props.handleChange()
    }
  }

  generateWindowsBrowser = () => {
    Modal.confirm({
      width: 500,
      title: i18n.t('browser.generate_windows_browser_confirm'),
      content: i18n.t('browser.generate_windows_browser_confirm_description'),
      onOk: this.performGenerateWindowsBrowser,
    })
  }

  performGenerateWindowsBrowser = () => {
    this.props.generateWindowsBrowser(this.props.params.id).then(
      repsonse => {
        if (!repsonse.error) this.props.handleChange()
      }
    )
  }

  renderPlatformName = (platform) => {
    const icon = (platform === 'macOS' || platform === 'iOS') ? 'apple' : platform
    return (
      <Tag>
        <Icon type={icon.toLowerCase()} /> {platform}
      </Tag>
    )
  }

  renderActions = (name, platform = {}) => {
    const actions = []
    if (platform.link) {
      actions.push(
        <Button onClick={() => { window.location.href = platform.link }} size="small">
          <Icon type="download" /> {i18n.t('actions.download')}
        </Button>
      )
      actions.push(
        <CopyToClipboard text={platform.link} onCopy={this.onCopy} size="small">
          <Button style={{ marginLeft: 5, marginRight: 30 }}><Icon type="copy" /> {i18n.t('actions.copy+browser.link')}</Button>
        </CopyToClipboard>
      )
    }
    if (name === 'Windows') {
      if (platform.status === 2) {
        actions.push(
          <span style={{ marginLeft: 10 }}>
            <Icon type="loading" /> {i18n.t('browser.actions.generating')}
          </span>
        )
      } else {
        actions.push(
          <Button type="danger" size="small" onClick={this.generateWindowsBrowser}>
            <Icon type="plus" /> {i18n.t('actions.generate+browser.title')}
          </Button>
        )
      }
      if (platform.status === 3) {
        actions.push(
          <span className="highlight" style={{ marginLeft: 10 }}>
            <Icon type="exclamation-circle" /> {i18n.t('browser.generation_failed')}
          </span>
        )
      }
    } else {
      actions.push(
        <Button type="danger" size="small" onClick={this.showNewVersionModal(name, platform.link)}>
          <Icon type="plus" /> {i18n.t(platform.version ? 'actions.update+browser.version' : 'actions.add+browser.version')}
        </Button>
      )
    }
    return actions
  }

  renderPlatform = (name, platform) =>
    (
      platform ?
        <div style={{ display: 'table-row' }}>
          <div style={{ display: 'table-cell', width: 120 }}>{this.renderPlatformName(name)}</div>
          <div style={{ display: 'table-cell', width: 120 }}>
            {
              platform.version ||
              <span style={{ color: '#ccc' }}>not exist</span>
            }
          </div>
          <div style={{ display: 'table-cell' }}>{this.renderActions(name, platform)}</div>
        </div> :
        <div style={{ display: 'table-row' }}>
          <div style={{ display: 'table-cell', width: 120 }}>{this.renderPlatformName(name)}</div>
          <div style={{ display: 'table-cell', color: '#ccc', width: 120 }}>not exist</div>
          <div style={{ display: 'table-cell' }}>{this.renderActions(name, platform)}</div>
        </div>
    )

  render() {
    return (
      <div className="ant-form">
        <WrappedFormItem
          width="100%"
          {...formItemLayout}
          label={i18n.t('browser.browsers')}>
          <div style={{ display: 'table' }}>
            {platforms.map(platform => this.renderPlatform(platform, this.props.data[platform]))}
          </div>
        </WrappedFormItem>
        {
          this.state.newVersionPlatform &&
          <NewBrowserVersionModal
            user={this.props.params.id}
            platform={this.state.newVersionPlatform}
            link={this.state.newVersionDefaultLink}
            save={this.props.createBrowserVersion}
            close={this.closeNewVersionModal} />
        }
      </div>
    )
  }
}
