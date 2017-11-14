import React from 'react'

export default () =>
  (
    <div style={{ marginTop: 150, textAlign: 'center' }}>
      <div
        style={{
          fontSize: 20,
          height: 40,
          lineHeight: '40px',
          display: 'inline-block',
          verticalAlign: 'bottom',
        }}>
        404
      </div>
      <div style={{
        marginLeft: 20,
        padding: '1px 20px',
        borderLeft: '2px solid #999',
        display: 'inline-block',
        height: 40,
        lineHeight: '20px',
        textAlign: 'left',
      }}>
        <div>页面不存在.</div>
        <div>This page could not be found.</div>
      </div>
    </div>
  )
