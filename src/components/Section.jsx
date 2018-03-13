import React from 'react'
import T from 'prop-types'
import withStyles from '../decorators/withStyles'
import s from './Section.css'
import { alpha } from '../utils/color'

const getStyle = ({ className, compress, line, bold, size, topfix, card }) => {
  const styles = [s.container, s[size]]
  if (compress) styles.push(s.compress)
  if (!card || line !== 'none') styles.push(s[`${line}line`])
  if (bold) styles.push(s.bold)
  if (topfix) styles.push(s.topfix)
  else if (card) styles.push(s.card)
  if (className) styles.push(className)
  return styles.join(' ')
}

const Section = ({
  title,
  supplement,
  tail,
  children,
  titleColor,
  contentClassName,
  width,
  style,
  ...styles }) =>
  (
    <div className={getStyle(styles)} style={{ ...style, borderColor: alpha(titleColor, 0.2) }}>
      {
        title &&
        <div className={s.title} style={{ borderColor: alpha(titleColor, 0.2) }}>
          <span style={{ color: titleColor }}>{title}</span>
          {supplement}
          {
            tail &&
            <div className={s.tail}>
              {tail}
            </div>
          }
        </div>
      }
      {
        children &&
        <div className={`${s.content} ${contentClassName}`} style={{ maxWidth: width || '100%' }}>
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
  compress: T.bool,
  line: T.string.oneOf(['none', 'solid', 'dashed']),
  bold: T.bool,
  size: T.oneOf(['small', 'normal', 'large']),
  titleColor: T.string,
  contentClassName: T.string,
  width: T.number,
  style: T.object,
  card: T.bool,
  topfix: T.bool,
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
  style: {},
  card: false,
  topfix: false,
}

export default withStyles(s)(Section)
