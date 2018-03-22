import React from 'react'
import T from 'prop-types'
import { Form, Input, Modal } from 'antd'
import { WrappedFormItem } from '../../components'
import { formLayout } from '../../constant'

const { formItemLayout } = formLayout

@Form.create()
export default class NewBrowserVersionModal extends React.Component {
  static propTypes = {
    user: T.string.isRequired,
    platform: T.string.isRequired,
    link: T.string,
    save: T.func.isRequired,
    close: T.func.isRequired,
    form: T.object.isRequired,
  }

  static defaultProps = {
    link: ''
  }

  state = {
    saving: false,
    visible: true,
    link: this.props.link
  }

  submit = () => {
    const { user, platform, form, save } = this.props
    form.validateFieldsAndScroll({ scroll: { offsetTop: 120 } }, (err, values) => {
      if (!err) {
        const state = { saving: true }
        const { link, version } = values
        state.link = link
        this.setState(state)
        const data = { user, platform, link, version }
        save(data).then(
          response => {
            if (!response.error) {
              this.close(true)
            } else {
              state.saving = false
              this.setState(state)
            }
          }
        )
      }
    })
  }

  close = (shouldReload) => {
    this.setState({ visible: false, saving: false })
    setTimeout(() => {
      this.props.close(shouldReload)
    }, 500)
  }

  render() {
    const { form, platform } = this.props
    return (
      <Modal
        width={700}
        title={i18n.t('actions.create+browser.version')}
        visible={this.state.visible}
        confirmLoading={this.state.saving}
        onOk={this.submit}
        okText={i18n.t('actions.create')}
        onCancel={() => this.close()}>
        <Form>
          <WrappedFormItem
            {...formItemLayout}
            label={i18n.t('browser.platform')}>
            {platform}
          </WrappedFormItem>
          <WrappedFormItem
            {...formItemLayout}
            label={i18n.t('browser.link')}>
            {form.getFieldDecorator('link', { rules: [{ required: true }], initialValue: this.state.link })(<Input />)}
          </WrappedFormItem>
          <WrappedFormItem
            noline
            {...formItemLayout}
            label={i18n.t('browser.version')}>
            {form.getFieldDecorator('version', { rules: [{ required: true }] })(<Input />)}
          </WrappedFormItem>
        </Form>
      </Modal>
    )
  }
}
