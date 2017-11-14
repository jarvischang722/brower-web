import React from 'react'
import T from 'prop-types'
import withStyles from '../decorators/withStyles'
import style from './Section.css'
import { alpha } from '../utils/color'

const getStyle = ({ className, compress, line, bold, size }) => {
  const styles = [style.container, style[size]]
  if (compress) styles.push(style.compress)
  if (line) styles.push(style[`${line}line`])
  if (bold) styles.push(style.bold)
  if (className) styles.push(className)
  return styles.join(' ')
}

const Section = ({ title, supplement, tail, children, titleColor, contentClassName, width, ...styles }) =>
  (
    <div className={getStyle(styles)}>
      {
        title &&
        <div className={style.title} style={{ borderColor: alpha(titleColor, 0.2) }}>
          <span style={{ color: titleColor }}>{title}</span>
          {supplement}
          {
            tail &&
            <div className={style.tail}>
              {tail}
            </div>
          }
        </div>
      }
      {
        children &&
        <div className={`${style.content} ${contentClassName}`} style={{ maxWidth: width || '100%' }}>
          {children}
        </div>
      }
    </div>
  )

Section.propTypes = {
  title: T.string,
  supplement: T.any,
  tail: T.string,
  children: T.any,
  compress: T.boolean,
  line: T.string.oneOf(['none', 'solid', 'dashed']),
  bold: T.boolean,
  size: T.oneOf(['small', 'normal', 'large']),
  titleColor: T.string,
  contentClassName: T.string,
  width: T.number,
}

Section.defaultProps = {
  title: null,
  supplement: null,
  tail: null,
  children: null,
  compress: false,
  line: 'none',
  bold: false,
  size: 'normal',
  titleColor: '#444',
  contentClassName: '',
  width: null,
}

export default withStyles(style)(Section)
