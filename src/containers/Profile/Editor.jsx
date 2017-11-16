import url from 'url'
import React from 'react'
import T from 'prop-types'
import { Link } from 'react-router'
import { Form, Input, Select, Button, Row, Col } from 'antd'
import moment from 'moment'
import { Section, WrappedFormItem } from '../../components'
import { roles, formLayout } from '../../constant'
import api from '../../utils/api'

const Option = Select.Option

const { formItemLayout } = formLayout

@Form.create()
export default class Profile extends React.Component {
  static propTypes = {
    user: T.object.isRequired,
    save: T.func.isRequired,
    form: T.object.isRequired,
  }

  state = {
    editing: '',
    submitting: false,
  }

  handleSubmit = (e) => {
    e.preventDefault()
    const { submitting } = this.state
    if (submitting) return
    const { user, form, save } = this.props
    form.validateFieldsAndScroll({ scroll: { offsetTop: 120 } }, (err, values) => {
      if (!err) {
        const { name, homeUrl, icon } = values
        const agent = { name, homeUrl, icon }
        agent.id = user.id
        this.setState({ submitting: true })
        save(agent)
          .then(
            () => {
              this.setState({ editing: '', submitting: false })
            }
          )
      }
    })
  }

  edit = (key = '') =>
    () => { this.setState({ editing: key }) }

  field = (name) => {
    const { user, form } = this.props
    const rules = []
    let initialValue
    let component
    switch (name) {
      case 'username':
        rules.push({ required: true, message: i18n.t('agent.validation.username_required') })
        initialValue = user.username
        component = <Input size="large" />
        break
      case 'name':
        rules.push({ required: true, message: i18n.t('agent.validation.name_required') })
        initialValue = user.name
        component = <Input size="large" />
        break
      case 'role':
        rules.push({ required: true })
        initialValue = user.role
        component = (
          <Select size="large">
            {
              roles.map(
                item => (
                  <Option value={item.value}>{item.text}</Option>
                )
              )
            }
          </Select>
        )
        break
      default:
    }
    return form.getFieldDecorator(name, { rules, initialValue })(component)
  }

  renderRole() {
    const { user } = this.props
    return roles.find(({ value }) => user.role === value).text
  }

  renderEditingField = (key) => (
    <Row>
      <Col span={20}>
        {this.field(key)}
      </Col>
      <Col span={3} offset={1} className="nowrap">
        <Button type="primary" htmlType="submit" size="large">{i18n.t('actions.save')}</Button>
        <Button style={{ marginLeft: 10 }} onClick={this.edit()} size="large">{i18n.t('actions.cancel')}</Button>
      </Col>
    </Row>
  )

  render() {
    const { user } = this.props
    const items = [
      <WrappedFormItem
        {...formItemLayout}
        label={i18n.t('profile.role')}>
        {this.renderRole()}
      </WrappedFormItem>,
      <WrappedFormItem
        {...formItemLayout}
        label={i18n.t('auth.username')}>
        {user.username}
      </WrappedFormItem>,
      <WrappedFormItem
        {...formItemLayout}
        label={i18n.t('profile.name')}>
        {
          this.state.editing === 'name' ? this.renderEditingField('name') : [
            user.name,
            <Link style={{ float: 'right' }} onClick={this.edit('name')}>{i18n.t('actions.modify')}</Link>
          ]
        }
      </WrappedFormItem>,
      <WrappedFormItem
        {...formItemLayout}
        label={i18n.t('profile.icon')}>
        {
          (api.basename && user.icon) ? (
            <img
              src={url.resolve(api.basename, user.icon)}
              alt="icon"
              style={{ width: 50, height: 50, position: 'absolute', top: -10 }} />
          ) : '-'
        }
      </WrappedFormItem>,
      <WrappedFormItem
        {...formItemLayout}
        label={i18n.t('profile.home_url')}>
        {
          this.state.editing === 'home_url' ? this.renderEditingField('home_url') : [
            user.homeUrl && user.homeUrl.length > 0 ? user.homeUrl.map(u => <div>{u}</div>) : '-',
            <Link style={{ float: 'right' }} onClick={this.edit('home_url')}>{i18n.t('actions.modify')}</Link>
          ]
        }
      </WrappedFormItem>,
      <WrappedFormItem
        {...formItemLayout}
        label={i18n.t('profile.expire_in')}>
        {
          this.state.editing === 'expire_in' ? this.renderEditingField('expire_in') : [
            user.expireIn ? moment(user.expireIn * 1000).format('YYYY-MM-DD HH:mm') : '-',
            <Link style={{ float: 'right' }} onClick={this.edit('expire_in')}>{i18n.t('actions.modify')}</Link>
          ]
        }
      </WrappedFormItem>,
    ]
    return (
      <Form onSubmit={this.handleSubmit}>
        {items}
      </Form>
    )
  }
}
