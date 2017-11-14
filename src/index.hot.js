import React from 'react'
import ReactDOM from 'react-dom'
import Root from './containers/Root'
import configureStore from './store/configureStore'
import router from './router'
import { wrap } from './devTool'

/* eslint-disable no-underscore-dangle */
const store = configureStore(
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
)
/* eslint-enable */

// Global (context) variables that can be easily accessed from any React component
// https://facebook.github.io/react/docs/context.html
const context = {
  // Enables critical path CSS rendering
  // https://github.com/kriasoft/isomorphic-style-loader
  insertCss: (...styles) => {
    // eslint-disable-next-line no-underscore-dangle
    const removeCss = styles.map(x => x._insertCss())
    return () => { removeCss.forEach(f => f()) }
  },
}

const render = () => {
  ReactDOM.render(
    // eslint-disable-next-line react/jsx-filename-extension
    // <Root store={store} router={router} context={context} />,
    <Root store={store} router={router} context={context} wrap={wrap} />,
    document.getElementById('root')
  )
}

render()

// module.hot.accept('./router', render)
module.hot.accept(undefined, render)
