/**
 * Isomorphic CSS style loader for Webpack
 *
 * Copyright © 2015-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import hoistStatics from 'hoist-non-react-statics'

const types = {
  insertCss: PropTypes.func,
}

function withStyles(...styles) {
  return function wrapWithStyles(ComposedComponent) {
    class WithStyles extends Component {
      componentWillMount() {
        const insertCss = this.context.insertCss || this.props.insertCss
        if (insertCss) this.removeCss = insertCss(...styles)
      }

      componentWillUnmount() {
        if (this.removeCss) {
          setTimeout(this.removeCss, 0)
        }
      }

      render() {
        return <ComposedComponent {...this.props} />
      }
    }

    const displayName = ComposedComponent.displayName || ComposedComponent.name || 'Component'

    WithStyles.displayName = `WithStyles(${displayName})`
    WithStyles.propTypes = types
    WithStyles.contextTypes = types
    WithStyles.ComposedComponent = ComposedComponent

    return hoistStatics(WithStyles, ComposedComponent)
  }
}

export default withStyles
