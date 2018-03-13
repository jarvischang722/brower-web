import React from 'react'
import T from 'prop-types'
import { Form } from 'antd'

const FormItem = Form.Item

const WrappedFormItem = ({ width, noline, compress, children, style, className, ...rest }) => {
  const newClassName = ['ant-form-item-wrapper']
  if (className) newClassName.push(className)
  if (noline) newClassName.push('noline')
  if (compress) newClassName.push('compress')
  return (
    <div className={newClassName.join(' ')} style={style}>
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
  style: T.object,
  className: T.string,
}

WrappedFormItem.defaultProps = {
  width: 600,
  noline: false,
  compress: false,
  style: null,
  className: '',
}

export default WrappedFormItem
