import React from 'react'
import T from 'prop-types'
import { Tag, Icon } from 'antd'
import { WrappedFormItem } from '../../components'
import { formLayout } from '../../constant'

const { formItemLayout } = formLayout

const platforms = ['windows', 'mac', 'ios', 'android']

export default class BrowserVersions extends React.Component {
  static propTypes = {
    data: T.object,
  }

  static defaultProps = {
    data: {}
  }

  renderPlatformName = (platform) => {
    const icon = (platform === 'mac' || platform === 'ios') ? 'apple' : platform
    return (
      <Tag>
        <Icon type={icon} /> {platform}
      </Tag>
    )
  }

  renderPlatform = (name, platform) =>
    (
      platform ?
        <div style={{ display: 'table-row' }}>
          <div style={{ display: 'table-cell', width: 120 }}>{this.renderPlatformName(name)}</div>
          <div style={{ display: 'table-cell', width: 120 }}>{platform.version}</div>
          <div style={{ display: 'table-cell' }}>
            <a href={platform.link} className="nowrap">{platform.link}</a>
          </div>
        </div> :
        <div style={{ display: 'table-row' }}>
          <div style={{ display: 'table-cell', width: 120 }}>{this.renderPlatformName(name)}</div>
          <div style={{ display: 'table-cell', color: '#ccc', width: 120 }}>not exist</div>
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
      </div>
    )
  }
}
