import React from 'react'
import { browserHistory, Router, Route, IndexRoute } from 'react-router'
import * as containers from './containers'

const {
  App,
  Auth,
  // Account,
  Agent,
  Error,
} = containers

export default (
  <Router history={browserHistory} key={module.hot ? Math.random() : 1}>
    <Route path="/login" component={Auth.Login} />
    <Route path="/logout" component={Auth.Logout} />
    <Route path="/" component={App.Wrapper}>
      <IndexRoute component={App.Home} />
      <Route path="/agents" component={App.ContentWrapper} title="agent.title" visible={(user) => user.role === 1}>
        <IndexRoute component={Agent.List} />
        <Route path="/agents/:id/browser" component={Agent.CreateBrowser} title="agent.manage+browser.title" />
      </Route>
      <Route path="*" component={App.ContentWrapper}>
        <IndexRoute component={Error.NotFound} />
      </Route>
    </Route>
  </Router>
)
