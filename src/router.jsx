import React from 'react'
import { browserHistory, Router, Route, IndexRoute } from 'react-router'
import * as containers from './containers'

const {
  App,
  Auth,
  Account,
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
        <Route path="/agents/:id" component={Agent.Item} title="agent.profile" />
      </Route>
      <Route path="/browser" component={App.ContentWrapper} title="browser.title">
        <IndexRoute component={Account.Profile} />
      </Route>
      <Route path="/profile" component={App.ContentWrapper} title="profile.title">
        <IndexRoute component={Account.Profile} />
      </Route>
      <Route path="*" component={App.ContentWrapper}>
        <IndexRoute component={Error.NotFound} />
      </Route>
    </Route>
  </Router>
)
