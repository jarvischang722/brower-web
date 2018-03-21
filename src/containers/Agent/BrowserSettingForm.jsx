import React from 'react'
import T from 'prop-types'
import { Form, Input, Button, Col } from 'antd'
import { Section, WrappedFormItem, Upload } from '../../components'
import { formLayout } from '../../constant'

const { TextArea } = Input
const FormItem = Form.Item

const { formItemLayout, tailFormItemLayout } = formLayout

@Form.create()
export default class BrowserSettingForm extends React.Component {
  static propTypes = {
    editable: T.bool,
    initialValues: T.object.isRequired,
    iconPreview: T.string,
    save: T.func.isRequired,
    form: T.object.isRequired,
    onSave: T.func.isRequired,
    onCancel: T.func.isRequired,
    onUpdateState: T.func.isRequired,
  }

  static defaultProps = {
    editable: false,
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
        const { name, icon, homeUrl } = values
        const data = {}
        if (initialValues.id) data.id = initialValues.id
        data.name = name
        data.icon = icon || ''
        if (initialValues.id) data.homeUrl = homeUrl ? homeUrl.split('\n').filter(l => !!l) : initialValues.homeUrl
        const isFormData = icon instanceof File
        if (isFormData) data.isFormData = true
        this.setState({ submitting: true })
        save(data)
          .then(
            response => {
              this.setState({ submitting: false })
              if (!response.error) {
                this.setState({ initialValues: response })
                this.props.onSave(response)
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
    if (this.state.submitting) return i18n.t('actions.submitting')
    return i18n.t('actions.save+browser.settings')
  }

  cancel = () => {
    this.props.onCancel()
  }

  enterEdit = () => {
    this.props.onUpdateState(true)
  }

  renderHomeUrls = (homeUrl) => {
    if (!homeUrl || homeUrl.length === 0) return '-'
    return (
      <Col span={20} className="monospace" style={{ lineHeight: '19px', padding: '11px 0', width: '100%' }}>
        { homeUrl.map(u => <div>{u}</div>) }
      </Col>
    )
  }

  render() {
    const { editable, iconPreview } = this.props
    const { initialValues } = this.state
    return (
      <Form onSubmit={this.handleSubmit}>
        <WrappedFormItem
          {...formItemLayout}
          label={i18n.t('auth.username')}>
          {initialValues.username}
        </WrappedFormItem>
        <WrappedFormItem
          {...formItemLayout}
          label={i18n.t('profile.name')}>
          {editable ? this.field('name') : initialValues.name}
        </WrappedFormItem>
        <WrappedFormItem
          {...formItemLayout}
          label={i18n.t('profile.icon')}>
          {
            editable ?
              this.field('icon') :
              <img src={iconPreview} style={{ width: 80, height: 80 }} alt="icon" />
          }
        </WrappedFormItem>
        <WrappedFormItem
          {...formItemLayout}
          label={i18n.t('profile.home_url')}>
          {
            editable ?
              this.field('homeUrl') :
              this.renderHomeUrls(initialValues.homeUrl)
          }
        </WrappedFormItem>
        {
          editable ?
            <Section width={600}>
              <FormItem {...tailFormItemLayout}>
                <Button type="primary" htmlType="submit" size="large" loading={this.state.submitting}>
                  {this.getSubmitText()}
                </Button>
                <Button size="large" disabled={this.state.submitting} style={{ marginLeft: 20 }} onClick={this.cancel}>
                  {i18n.t('actions.cancel')}
                </Button>
              </FormItem>
            </Section> :
            <WrappedFormItem {...tailFormItemLayout}>
              <Button type="primary" onClick={this.enterEdit}>Modify Settings</Button>
            </WrappedFormItem>
        }
      </Form>
    )
  }
}
