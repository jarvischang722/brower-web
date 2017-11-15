import React from 'react'
import T from 'prop-types'
import { connect } from 'react-redux'
import { Form, Input, Button, Icon } from 'antd'
import { Section } from '../../components'
import MessageHandler from '../App/MessageHandler'
import { UserActions } from '../../actions'

const formItemLayout = {
  wrapperCol: {
    span: 12,
    offset: 6,
  },
}

@connect(
  ({ user }) => ({ user: user.data || {} }),
  { login: UserActions.actions.login }
)
@Form.create()
export default class Login extends React.Component {
  static propTypes = {
    user: T.object.isRequired,
    login: T.func.isRequired,
    form: T.object.isRequired,
  }

  static contextTypes = {
    router: T.object.isRequired,
  }

  state = {
    submitting: false,
  }

  componentWillMount() {
    if (this.props.user.id) {
      this.context.router.replace('/')
    }
  }

  handleSubmit = (e) => {
    e.preventDefault()
    if (this.state.submitting) return
    const { form, login } = this.props
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.setState({ submitting: true })
        const { name, password } = values
        login(name, password)
          .then(
            ({ error }) => {
              this.setState({ submitting: false })
              if (!error) {
                this.context.router.push('/')
              }
            }
          )
      }
    })
  }

  field = (name) => {
    const { form } = this.props
    const rules = []
    let component
    switch (name) {
      case 'name':
        rules.push({ required: true, message: i18n.t('auth.validation.username_required') })
        component = <Input prefix={<Icon type="user" style={{ fontSize: 13 }} />} placeholder={i18n.t('auth.username')} />
        break
      case 'password':
        rules.push({ required: true, message: i18n.t('auth.validation.password_required') })
        component = <Input prefix={<Icon type="lock" style={{ fontSize: 13 }} />} type="password" placeholder={i18n.t('auth.password')} />
        break
      default:
    }
    return component
      ? form.getFieldDecorator(name, { rules })(component)
      : null
  }

  getSubmitText = () => {
    if (this.state.submitting) return i18n.t('loading')
    return i18n.t('auth.login')
  }

  renderForm() {
    return (
      <Form
        onSubmit={this.handleSubmit}
        style={{
          padding: 20,
          backgroundColor: '#f8fafc',
          borderRadius: 10,
          boxShadow: '1px 1px 4px rgba(0, 0, 0, 0.1)',
        }} >
        <Section title="BROWSER WEB" tail={i18n.t('auth.login')} bold titleColor="#ec6565" line="solid">
          <Form.Item {...formItemLayout} >
            {this.field('name')}
          </Form.Item>
          <Form.Item {...formItemLayout} >
            {this.field('password')}
          </Form.Item>
        </Section>
        <Form.Item {...formItemLayout}>
          <Button type="primary" htmlType="submit" size="large" loading={this.state.submitting}>
            {this.getSubmitText()}
          </Button>
        </Form.Item>
      </Form>
    )
  }

  render() {
    return (
      <div style={{ width: 500, margin: '100px auto' }}>
        { this.renderForm() }
        <MessageHandler {...this.props} />
      </div>
    )
  }
}
