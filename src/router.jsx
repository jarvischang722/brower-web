import React from 'react'
import { browserHistory, Router, Route, IndexRoute } from 'react-router'
import * as containers from './containers'

const {
  App,
  Auth,
  // Account,
  Agent,
  ShortLink,
  Error,
  Player,
  Keyword,
  BlackWhite,
  Promotion
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
      <Route path="/shorts" component={App.ContentWrapper} title="short_link.title" visible={(user) => user.role === 1}>
        <IndexRoute component={ShortLink.List} />
        <Route path="/shorts/new" component={ShortLink.New} title="actions.add" />
        <Route path="/shorts/:id" component={ShortLink.Item} title="actions.edit" />
      </Route>
      <Route path="/player" component={App.ContentWrapper} title="player.title" visible={(user) => user.role === 1}>
        <IndexRoute component={Player.List} />
      </Route>
      <Route path="/keyword" component={App.ContentWrapper} title="keyword.title" visible={(user) => user.role === 1}>
        <IndexRoute component={Keyword.List} />
      </Route>
      <Route path="/black_white_list" component={App.ContentWrapper} title="black_white_list.title" visible={(user) => user.role === 1}>
        <IndexRoute component={BlackWhite.List} />
      </Route>
      <Route path="/promotion" component={App.ContentWrapper} title="Promotion" visible={(user) => user.role === 1}>
        <IndexRoute component={Promotion.Edit} />
      </Route>
      <Route path="*" component={App.ContentWrapper}>
        <IndexRoute component={Error.NotFound} />
      </Route>
    </Route>
  </Router>
)
