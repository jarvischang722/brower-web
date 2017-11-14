import React from 'react'
import T from 'prop-types'
import { Form } from 'antd'

const FormItem = Form.Item

const WrappedFormItem = ({ width, noline, compress, children, ...rest }) => {
  const className = ['ant-form-item-wrapper']
  if (noline) className.push('noline')
  if (compress) className.push('compress')
  return (
    <div className={className.join(' ')}>
      <div style={{ width, minWidth: 500 }}>
        <FormItem {...rest} colon={false}>
          {children}
        </FormItem>
      </div>
    </div>
  )
}

WrappedFormItem.propTypes = {
  width: T.oneOfType([T.number, T.string]),
  noline: T.boolean,
  compress: T.boolean,
  children: T.any.isRequired,
}

WrappedFormItem.defaultProps = {
  width: 600,
  noline: false,
  compress: false,
}

export default WrappedFormItem
