import React from 'react'
import T from 'prop-types'
import { Link } from 'react-router'
import { Form, Input, DatePicker, Button, Row, Col } from 'antd'
import moment from 'moment'
import { WrappedFormItem, Upload } from '../../components'
import { roles, formLayout } from '../../constant'

const { TextArea } = Input

const { formItemLayout } = formLayout

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
    editing: '',
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
        const { name, icon, homeUrl, expireIn } = values
        const data = { icon }
        data.id = initialValues.id
        data.name = name || initialValues.name
        data.homeUrl = homeUrl ? homeUrl.split('\n').filter(l => !!l) : initialValues.homeUrl
        // data.expireIn = expireIn ? precision(expireIn.valueOf() / 1000, 0) : initialValues.expireIn
        const isFormData = icon instanceof File
        if (isFormData) data.isFormData = true
        this.setState({ submitting: true })
        save(data)
          .then(
            response => {
              this.setState({ editing: '', submitting: false })
              if (!response.error) {
                this.props.onEndEditing(response, isFormData)
              }
            }
          )
      }
    })
  }

  edit = (key = '') =>
    () => { this.setState({ editing: key }) }

  field = (name) => {
    const { form, iconPreview } = this.props
    const rules = []
    const props = {}
    let initialValue = this.state.initialValues[name]
    let component
    switch (name) {
      // case 'role':
      //   rules.push({ required: true })
      //   initialValue = user.role
      //   component = (
      //     <Select size="large">
      //       {
      //         roles.map(
      //           item => (
      //             <Option value={item.value}>{item.text}</Option>
      //           )
      //         )
      //       }
      //     </Select>
      //   )
      //   break
      // case 'username':
      //   rules.push({ required: true, message: i18n.t('profile.validation.username_required') })
      //   initialValue = user.username
      //   component = <Input size="large" />
      //   break
      case 'name':
        rules.push({ required: true, message: i18n.t('profile.validation.name_required') })
        component = <Input size="large" />
        break
      case 'homeUrl':
        rules.push({ required: true, message: i18n.t('profile.validation.home_url_required') })
        initialValue = initialValue ? initialValue.join('\n') : ''
        component = (
          <TextArea
            autosize={{ minRows: 1 }}
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
        component = (
          <Upload
            content={iconPreview}
            width={80}
            height={80} />
        )
        break
      case 'expireIn':
        initialValue = initialValue ? moment(initialValue) : undefined
        component = (
          <DatePicker />
        )
        break
      default:
    }
    return form.getFieldDecorator(name, { rules, initialValue, ...props })(component)
  }

  normIconFile = () =>
    [this.state.icon]

  onSelectIconFile = (icon) => {
    this.setState({ icon }, () => {
      this.handleSubmit({ file: icon })
    })
    return false
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

  renderHomeUrls = (homeUrl) => {
    if (!homeUrl || homeUrl.length === 0) return '-'
    return (
      <Col span={20} className="monospace" style={{ lineHeight: '19px', padding: '5px 0', width: '100%' }}>
        { homeUrl.map(u => <div>{u}</div>) }
      </Col>
    )
  }

  render() {
    const { initialValues } = this.state
    const items = [
      <WrappedFormItem
        {...formItemLayout}
        label={i18n.t('profile.role')}>
        {this.renderRole()}
      </WrappedFormItem>,
      <WrappedFormItem
        {...formItemLayout}
        label={i18n.t('auth.username')}>
        {initialValues.username}
      </WrappedFormItem>,
      <WrappedFormItem
        {...formItemLayout}
        label={i18n.t('profile.name')}>
        {
          this.state.editing === 'name' ? this.renderEditingField('name') : [
            initialValues.name,
            <Link style={{ float: 'right' }} onClick={this.edit('name')}>{i18n.t('actions.modify')}</Link>
          ]
        }
      </WrappedFormItem>,
      <WrappedFormItem
        {...formItemLayout}
        label={i18n.t('profile.icon')}>
        {this.field('icon')}
      </WrappedFormItem>,
      <WrappedFormItem
        {...formItemLayout}
        label={i18n.t('profile.home_url')}>
        {
          this.state.editing === 'homeUrl' ? this.renderEditingField('homeUrl') : [
            this.renderHomeUrls(initialValues.homeUrl),
            <Link style={{ float: 'right', marginTop: 10 }} onClick={this.edit('homeUrl')}>{i18n.t('actions.modify')}</Link>
          ]
        }
      </WrappedFormItem>,
      <WrappedFormItem
        {...formItemLayout}
        label={i18n.t('profile.expire_in')}>
        {
          this.state.editing === 'expireIn' ? this.renderEditingField('expireIn') : [
            initialValues.expireIn ? moment(initialValues.expireIn * 1000).format('YYYY-MM-DD HH:mm') : '-',
            <Link style={{ float: 'right' }} onClick={this.edit('expireIn')}>{i18n.t('actions.modify')}</Link>
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
