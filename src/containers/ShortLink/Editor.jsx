import url from 'url'
import React from 'react'
import T from 'prop-types'
import { Form, Input, Button } from 'antd'
import { Section, WrappedFormItem, Upload } from '../../components'
import { formLayout } from '../../constant'
import api from '../../utils/api'

const generateLogoUrl = (logo) => {
  if (!logo) return ''
  if (logo.indexOf('http') === 0) return logo
  return `${url.resolve(api.basename, logo)}`
}

const FormItem = Form.Item

const { formItemLayout, tailFormItemLayout } = formLayout

@Form.create()
export default class Editor extends React.Component {
  static propTypes = {
    initialValues: T.object,
    save: T.func.isRequired,
    form: T.object.isRequired,
    onEndEditing: T.func.isRequired,
  }

  static defaultProps = {
    initialValues: {}
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
        const { short, long, site_name, logo_url } = values
        const data = { short, long }
        if (initialValues.id) data.id = initialValues.id
        if (site_name) data.site_name = site_name
        if (logo_url) data.logo_url = logo_url
        const isFormData = logo_url instanceof File
        if (isFormData) data.isFormData = true
        this.setState({ submitting: true })
        save(data)
          .then(
            response => {
              this.setState({ submitting: false })
              if (!response.error) {
                this.props.onEndEditing()
              }
            }
          )
      }
    })
  }

  field = (name) => {
    const { form } = this.props
    const rules = []
    const props = {}
    const initialValue = this.state.initialValues[name]
    let component
    switch (name) {
      case 'long':
      case 'short':
        rules.push({ required: true })
        component = <Input size="large" />
        break
      case 'site_name':
        component = <Input size="large" />
        break
      case 'logo_url':
        component = (
          <Upload
            content={initialValue ? generateLogoUrl(initialValue) : null}
            width={80}
            height={80} />
        )
        break
      default:
    }
    return form.getFieldDecorator(name, { rules, initialValue, ...props })(component)
  }

  getSubmitText = () => {
    if (this.state.submitting) return i18n.t('actions.submitting')
    return i18n.t('actions.save+browser.settings')
  }

  render() {
    return (
      <Form onSubmit={this.handleSubmit}>
        <WrappedFormItem
          {...formItemLayout}
          label={i18n.t('short_link.long')}>
          {this.field('long')}
        </WrappedFormItem>
        <WrappedFormItem
          {...formItemLayout}
          label={i18n.t('short_link.short')}>
          {this.field('short')}
        </WrappedFormItem>
        <WrappedFormItem
          {...formItemLayout}
          label={i18n.t('short_link.site_name')}>
          {this.field('site_name')}
        </WrappedFormItem>
        <WrappedFormItem
          {...formItemLayout}
          label={i18n.t('short_link.logo')}>
          {this.field('logo_url')}
        </WrappedFormItem>
        <Section width={600}>
          <FormItem {...tailFormItemLayout}>
            <Button type="primary" htmlType="submit" size="large" loading={this.state.submitting}>
              {this.getSubmitText()}
            </Button>
            <Button size="large" disabled={this.state.submitting} style={{ marginLeft: 20 }} onClick={this.props.onEndEditing}>
              {i18n.t('actions.cancel')}
            </Button>
          </FormItem>
        </Section>
      </Form>
    )
  }
}
