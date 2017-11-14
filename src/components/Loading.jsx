import React from 'react'
import T from 'prop-types'
import { Spin } from 'antd'

const Loading = ({ text }) =>
  (
    <div style={{ lineHeight: '20px', paddingTop: 5, color: 'rgba(0, 0, 0, 0.4)' }}>
      <Spin style={{ marginRight: 10 }} /> {text || i18n.t('actions.loading')}
    </div>
  )

Loading.propTypes = {
  text: T.string,
}

export default Loading
