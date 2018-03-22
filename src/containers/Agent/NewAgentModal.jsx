import React from 'react'
import T from 'prop-types'
import { Form, Input, Modal } from 'antd'

const FormItem = Form.Item

@Form.create()
export default class NewAgentModal extends React.Component {
  static propTypes = {
    save: T.func.isRequired,
    close: T.func.isRequired,
    form: T.object.isRequired,
  }

  state = {
    saving: false,
    visible: true
  }

  submit = () => {
    const { form, save } = this.props
    form.validateFieldsAndScroll({ scroll: { offsetTop: 120 } }, (err, values) => {
      if (!err) {
        const state = { saving: true }
        this.setState(state)
        save(values).then(
          response => {
            if (!response.error) {
              this.close(response.id)
            } else {
              state.saving = false
              this.setState(state)
            }
          }
        )
      }
    })
  }

  close = (newAgentId) => {
    this.setState({ visible: false, saving: false })
    setTimeout(() => {
      this.props.close(newAgentId)
    }, 500)
  }

  render() {
    return (
      <Modal
        title={i18n.t('actions.create+role.agent')}
        visible={this.state.visible}
        confirmLoading={this.state.saving}
        onOk={this.submit}
        okText={i18n.t('actions.create')}
        onCancel={() => this.close()}>
        <Form className="ant-default-form">
          <FormItem
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 17 }}
            label={i18n.t('auth.username')}>
            {this.props.form.getFieldDecorator('username', { rules: [{ required: true }] })(<Input />)}
          </FormItem>
        </Form>
      </Modal>
    )
  }
}
