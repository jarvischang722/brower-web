import React from 'react'
import { browserHistory, Router, Route, IndexRoute } from 'react-router'
import * as containers from './containers'

const {
  App,
  Auth,
  Account,
  Error,
} = containers

export default (
  <Router history={browserHistory} key={module.hot ? Math.random() : 1}>
    <Route path="/login" component={Auth.Login} />
    <Route path="/logout" component={Auth.Logout} />
    <Route path="/" component={App.Wrapper}>
      <IndexRoute component={App.Home} />
      <Route path="/account" component={Account.Wrapper}>
        <IndexRoute component={Account.Profile} />
      </Route>
      <Route path="*" component={App.ContentWrapper}>
        <IndexRoute component={Error.NotFound} />
      </Route>
    </Route>
  </Router>
)
