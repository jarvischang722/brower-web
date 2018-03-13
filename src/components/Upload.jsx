import React from 'react'
import T from 'prop-types'
import { Upload, message, Button, Icon } from 'antd'
import withStyles from '../decorators/withStyles'
import style from './Upload.css'

function getBase64(img, callback) {
  const reader = new FileReader()
  reader.addEventListener('load', () => callback(reader.result))
  reader.readAsDataURL(img)
}

@withStyles(style)
export default class extends React.Component {
  static propTypes = {
    name: T.string.isRequired,
    // value: T.string,
    content: T.any,
    onChange: T.func.isRequired,
    sizeLimit: T.number,
    accept: T.oneOf(['image', 'video', 'audio']),
    width: T.number,
    height: T.number,
    trigger: T.any // oneOf(['none', 'button', 'icon']), or react element
  }

  static defaultProps = {
    // value: '',
    content: null,
    sizeLimit: 2 * 1024 * 1024, // 2MB
    accept: 'image',
    width: 50,
    height: 50,
    trigger: 'icon',
  }

  state = {}

  checkFileSize = (file) => {
    const { sizeLimit } = this.props
    if (file.size > sizeLimit) {
      message.error(i18n.t('file_size_limit', { size: sizeLimit }))
      return false
    }
    return true
  }

  beforeUpload = (file) => {
    const valid = this.checkFileSize(file)
    if (valid) {
      getBase64(file, content => this.setState({ content }))
      this.props.onChange(file)
    }
    return false
  }

  renderContent = () => {
    const { width, height } = this.props
    const content = this.state.content || this.props.content
    if (!content) return null
    if (this.props.accept === 'image') {
      const imgUrl = `url(${content})`
      return (
        <div
          className={style.imageContent}
          style={{ width, height, backgroundImage: imgUrl }} />
      )
    }
    return content
  }

  renderTrigger() {
    const { trigger, height, width } = this.props
    if (trigger === 'none') return null
    if (trigger === 'button') {
      return (
        <Button>
          <Icon type="upload" /> Upload
        </Button>
      )
    }
    if (trigger === 'icon') {
      return <Icon type="plus" className={style.trigger} style={{ height, width, lineHeight: `${height}px` }} />
    }
    return trigger
  }

  render() {
    const { name, width, height, accept, trigger } = this.props
    return (
      <Upload
        name={name}
        accept={`${accept}/*`}
        className={trigger === 'icon' && style.icon}
        style={{ width, height }}
        showUploadList={false}
        beforeUpload={this.beforeUpload}>
        {
          this.renderContent() || this.renderTrigger()
        }
      </Upload>
    )
  }
}
