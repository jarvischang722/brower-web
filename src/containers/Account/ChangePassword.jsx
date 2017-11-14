import React from 'react'
import T from 'prop-types'
import { connect } from 'react-redux'
import {
  Form, Input, Button, Alert,
} from 'antd'
import { Section } from '../../components'
import { formLayout } from '../../constant'
import { UserActions, MessageActions } from '../../actions'

const FormItem = Form.Item
const { formItemLayout, tailFormItemLayout } = formLayout

@connect(
  ({ user }) => ({
    user: (user && user.data) || {},
  }),
  {
    notify: MessageActions.actions.error,
    changePassword: UserActions.actions.changePassword
  }
)
@Form.create()
export default class ChangePassword extends React.Component {
  static propTypes = {
    route: T.object.isRequired,
    user: T.object.isRequired,
    form: T.object.isRequired,
    notify: T.func.isRequired,
    changePassword: T.func.isRequired,
  }

  static contextTypes = {
    router: T.object.isRequired,
  }

  state = {
    submitting: false,
  }

  componentWillMount() {
    this.context.router.setRouteLeaveHook(
      this.props.route,
      this.handleRouterWillLeave
    )
  }

  handleRouterWillLeave = ({ pathname }) => {
    if (pathname === '/logout') return null
    const { user, notify } = this.props
    if (user.status !== 2) {
      notify(i18n.t('auth.message.change_initial_password_alert'))
      return false
    }
    return null
  }

  handleSubmit = (e) => {
    e.preventDefault()
    const { submitting } = this.state
    if (submitting) return
    const { form, changePassword } = this.props
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const { oldPassword, newPassword } = values
        this.setState({ submitting: true })
        changePassword(oldPassword, newPassword)
          .then(
            (response) => {
              this.setState({ submitting: false })
              if (!response.error) this.context.router.replace('/account/security')
            }
          )
      }
    })
  }

  cancel = () => {
    this.context.router.push('/account/security')
  }

  field = (name) => {
    const { form } = this.props
    const rules = []
    const component = <Input type="password" />
    switch (name) {
      case 'oldPassword':
        rules.push({
          required: true,
          validator: (rule, value, callback) => {
            if (form.getFieldValue('newPassword')) form.validateFields(['newPassword'], { force: true })
            if (!value) callback(i18n.t('auth.validation.old_password_required'))
            else callback()
          }
        })
        break
      case 'newPassword':
        rules.push({
          required: true,
          validator: (rule, value, callback) => {
            if (form.getFieldValue('confirmNewPassword')) form.validateFields(['confirmNewPassword'], { force: true })
            if (!value) callback(i18n.t('auth.validation.new_password_required'))
            else if (value.length < 6) callback(i18n.t('auth.validation.password_invalid_length', { length: 6 }))
            else if (value === form.getFieldValue('oldPassword')) callback(i18n.t('auth.validation.new_password_should_not_as_same_as_old_password'))
            else callback()
          }
        })
        break
      case 'confirmNewPassword':
        rules.push({
          required: true,
          validator: (rule, value, callback) => {
            if (!value) callback(i18n.t('auth.validation.confirm_new_password_required'))
            else if (value !== form.getFieldValue('newPassword')) callback(i18n.t('auth.validation.confirm_new_password_not_same'))
            else callback()
          }
        })
        break
      default:
    }
    return form.getFieldDecorator(name, { rules })(component)
  }

  getSubmitText = () => {
    if (this.state.submitting) return i18n.t('actions.saving')
    return i18n.t('actions.save')
  }

  renderAlert() {
    if (this.props.user.status === 2) return null
    return (
      <Section width={600} compress>
        <Alert message={i18n.t('auth.change_password')} description={i18n.t('auth.message.change_initial_password_alert')} type="warning" showIcon />
      </Section>
    )
  }

  renderForm() {
    const { user } = this.props
    const activated = user.status === 2
    return (
      <Form onSubmit={this.handleSubmit}>
        { !activated && this.renderAlert() }
        <Section title={activated ? i18n.t('auth.change_password') : ''} width={600}>
          <FormItem
            {...formItemLayout}
            label={i18n.t('auth.old_password')}>
            {this.field('oldPassword')}
          </FormItem>
          <FormItem
            style={{ marginTop: 50 }}
            {...formItemLayout}
            label={i18n.t('auth.new_password')}>
            {this.field('newPassword')}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label={i18n.t('auth.confirm_new_password')}>
            {this.field('confirmNewPassword')}
          </FormItem>
        </Section>
        <Section width={600}>
          <FormItem {...tailFormItemLayout}>
            <Button type="primary" htmlType="submit" size="large" loading={this.state.submitting}>
              {this.getSubmitText()}
            </Button>
            {
              activated &&
              <Button size="large" disabled={this.state.submitting} style={{ marginLeft: 20 }} onClick={this.cancel}>
                {i18n.t('actions.cancel')}
              </Button>
            }
          </FormItem>
        </Section>
      </Form>
    )
  }

  render() {
    return this.renderForm()
  }
}
