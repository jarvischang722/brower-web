import React from 'react'
import T from 'prop-types'
import { Form, Input, Select, Button, Row, Col } from 'antd'
import { Section, WrappedFormItem, Upload } from '../../components'
import { roles, formLayout } from '../../constant'

const { TextArea } = Input
const { Option } = Select
const FormItem = Form.Item

const { formItemLayout, tailFormItemLayout } = formLayout

@Form.create()
export default class Profile extends React.Component {
  static propTypes = {
    initialValues: T.object.isRequired,
    iconPreview: T.string,
    save: T.func.isRequired,
    form: T.object.isRequired,
    onEndEditing: T.func.isRequired,
  }

  static defaultProps = {
    iconPreview: ''
  }

  state = {
    submitting: false,
    initialValues: this.props.initialValues,
  }

  handleSubmit = (e) => {
    if (e && e.preventDefault) e.preventDefault()
    const { submitting, initialValues } = this.state
    if (submitting) return
    const { form, save } = this.props
    form.validateFieldsAndScroll({ scroll: { offsetTop: 120 } }, (err, values) => {
      if (!err) {
        const { role, username, name, icon, homeUrl } = values
        const data = {}
        if (initialValues.id) data.id = initialValues.id
        data.name = name
        data.icon = icon || ''
        if (role) data.role = role
        if (username) data.username = username
        if (initialValues.id) data.homeUrl = homeUrl ? homeUrl.split('\n').filter(l => !!l) : initialValues.homeUrl
        const isFormData = icon instanceof File
        if (isFormData) data.isFormData = true
        this.setState({ submitting: true })
        save(data)
          .then(
            response => {
              this.setState({ submitting: false })
              if (!response.error) {
                this.props.onEndEditing(response)
              }
            }
          )
      }
    })
  }

  field = (name) => {
    const { form, iconPreview } = this.props
    const rules = []
    const props = {}
    let initialValue = this.state.initialValues[name]
    let component
    switch (name) {
      case 'role':
        rules.push({ required: true })
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
      case 'username':
        rules.push({ required: true, message: i18n.t('profile.validation.username_required') })
        component = <Input size="large" />
        break
      case 'name':
        rules.push({ required: true, message: i18n.t('profile.validation.name_required') })
        component = <Input size="large" />
        break
      case 'homeUrl':
        rules.push({ required: true, message: i18n.t('profile.validation.home_url_required') })
        initialValue = initialValue ? initialValue.join('\n') : ''
        component = (
          <TextArea
            autosize={{ minRows: 3 }}
            className="monospace"
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck={false}
            wrap="off"
            style={{ whiteSpace: 'pre', fontSize: 13 }} />
        )
        break
      case 'icon':
        rules.push({ required: true, message: i18n.t('profile.validation.icon_required') })
        component = (
          <Upload
            content={iconPreview}
            width={80}
            height={80} />
        )
        break
      // case 'expireIn':
      //   initialValue = initialValue ? moment(initialValue) : undefined
      //   component = (
      //     <DatePicker />
      //   )
      //   break
      default:
    }
    return form.getFieldDecorator(name, { rules, initialValue, ...props })(component)
  }

  getSubmitText = () => {
    if (this.state.submitting) return i18n.t('actions.saving')
    return i18n.t('actions.save')
  }

  cancel = () => {
    this.props.onEndEditing()
  }

  renderRole() {
    const { initialValues } = this.state
    return roles.find(({ value }) => initialValues.role === value).text
  }

  renderEditingField = (key) => (
    <Row>
      <Col span={key === 'homeUrl' ? 24 : 20}>
        {this.field(key)}
      </Col>
      <Col span={3} offset={key === 'homeUrl' ? 16 : 1} className="nowrap" style={{ marginTop: key === 'homeUrl' ? 10 : 0 }}>
        <Button type="primary" htmlType="submit" size="large">{i18n.t('actions.save')}</Button>
        <Button style={{ marginLeft: 10 }} onClick={this.edit()} size="large">{i18n.t('actions.cancel')}</Button>
      </Col>
    </Row>
  )

  render() {
    const { initialValues } = this.state
    return (
      <Form onSubmit={this.handleSubmit}>
        <Section>
          <WrappedFormItem
            {...formItemLayout}
            label={i18n.t('profile.role')}>
            {initialValues.id ? this.renderRole() : this.field('role')}
          </WrappedFormItem>
          <WrappedFormItem
            {...formItemLayout}
            label={i18n.t('auth.username')}>
            {initialValues.id ? initialValues.username : this.field('username')}
          </WrappedFormItem>
          <WrappedFormItem
            {...formItemLayout}
            label={i18n.t('profile.name')}>
            {this.field('name')}
          </WrappedFormItem>
          <WrappedFormItem
            {...formItemLayout}
            label={i18n.t('profile.icon')}>
            {this.field('icon')}
          </WrappedFormItem>
          <WrappedFormItem
            {...formItemLayout}
            label={i18n.t('profile.home_url')}>
            {this.field('homeUrl')}
          </WrappedFormItem>
        </Section>
        <Section width={600}>
          <FormItem {...tailFormItemLayout}>
            <Button type="primary" htmlType="submit" size="large" loading={this.state.submitting}>
              {this.getSubmitText()}
            </Button>
            <Button size="large" disabled={this.state.submitting} style={{ marginLeft: 20 }} onClick={this.cancel}>
              {i18n.t('actions.cancel')}
            </Button>
          </FormItem>
        </Section>
      </Form>
    )
  }
}
