import React from 'react'
import T from 'prop-types'
import is from '../utils/is'

function withChildRoutes(ComposedComponent) {
  return class WithChildRoutes extends React.Component {
    static propTypes = {
      route: T.shape({
        childRoutes: T.arrayOf(T.object),
        indexRoute: T.object,
      }).isRequired,
    }

    static childContextTypes = {
      childRoutes: T.arrayOf(T.shape({
        to: T.string,
        title: T.string,
        index: T.int,
        icon: T.string,
        isControl: T.boolean,
        scope: T.string,
      })),
    }

    static contextTypes = {
      router: T.object.isRequired,
    }

    getChildContext() {
      return {
        childRoutes: this.childRoutes,
      }
    }

    componentWillMount() {
      this.childRoutes = this.getChildRoutes()
    }

    getChildRoutes = (route = this.props.route) => {
      let routepath = route.path || '/'
      if (routepath[0] !== '/' && routepath.length > 1) {
        routepath = `/${routepath}`
      }

      const items = []
      const { indexRoute } = route
      if (indexRoute && !indexRoute.hideFromNavigation) {
        items.push({
          to: routepath,
          title: indexRoute.title,
          icon: indexRoute.icon,
          isControl: false, // indexRoute 不支持 control
          scope: route.scope,
          index: indexRoute.index || Number.MAX_INT,
          default: true,
          visible: indexRoute.visible || is.undefined(indexRoute.visible),
          badge: indexRoute.badge,
        })
      }

      if (route.childRoutes) {
        route.childRoutes.forEach((item) => {
          if (!item.hideFromNavigation) {
            const r = {
              to: item.path ? item.path : '',
              title: item.title,
              icon: item.icon,
              scope: route.path === '/' ? item.scope : route.scope,
              isControl: !!item.isControl,
              index: item.index || Number.MAX_VALUE,
              visible: item.visible || is.undefined(item.visible),
              badge: item.badge,
            }
            items.push(r)
            if (!r.to) r.children = this.getChildRoutes(item)
          }
        })
      }
      return items.length > 0 ? items : null
    }

    render() {
      // eslint-disable-next-line react/jsx-filename-extension
      return <ComposedComponent {...this.props} />
    }
  }
}

export default withChildRoutes
