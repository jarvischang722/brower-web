import React from 'react'
import T from 'prop-types'
import { Provider } from 'react-redux'
import '../locales'

const ContextType = {
  // Enables critical path CSS rendering
  // https://github.com/kriasoft/isomorphic-style-loader
  insertCss: T.func.isRequired,
}

export default class Root extends React.PureComponent {
  static propTypes = {
    context: T.shape(ContextType).isRequired,
    store: T.object.isRequired,
    router: T.object.isRequired,
    wrap: T.func,
  }

  static defaultProps = {
    wrap: (children) => children
  }

  static childContextTypes = ContextType

  getChildContext() {
    return this.props.context
  }

  render() {
    const { store, router, wrap } = this.props
    return (
      <Provider store={store}>
        { wrap(router) }
      </Provider>
    )
  }
}
