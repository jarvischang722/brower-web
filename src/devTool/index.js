import React from 'react'
import { Button } from 'antd'
import T from 'prop-types'
import { createProvider, connect } from 'refunk'
import XRay from 'react-x-ray'

const { AppContainer } = require('react-hot-loader')

const toggleXRay = state => {
  const { xray } = state
  xray.disabled = !xray.disabled
  return state
}

const Container = (props) => {
  const { children, xray } = props
  return (
    <AppContainer>
      <div>
        <XRay {...xray}>
          { children }
        </XRay>
        <div style={{ zIndex: 99999, position: 'fixed', left: 10, bottom: 10, width: 140 }}>
          <Button
            onClick={() => props.update(toggleXRay)}>
            XRay: { xray.disabled ? 'OFF' : 'ON' }
          </Button>
        </div>
      </div>
    </AppContainer>
  )
}

Container.propTypes = {
  xray: T.object.isRequired,
  children: T.object.isRequired,
  update: T.func.isRequired,
}

const initialState = {
  xray: { disabled: true }
}

export const WrappedContainer = createProvider(initialState)(connect()(Container))

export const wrap = (children) =>
  <WrappedContainer key={Math.random()}>{children}</WrappedContainer>

export default {
  WrappedContainer,
  wrap,
}
