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
      const { route } = this.props

      let routepath = route.path || '/'
      if (routepath[0] !== '/' && routepath.length > 1) {
        routepath = `/${routepath}`
      }

      const items = []
      const { indexRoute } = route
      if (indexRoute) {
        items.push({
          to: routepath,
          title: indexRoute.title,
          icon: indexRoute.icon,
          isControl: false, // indexRoute 不支持 control
          scope: route.scope,
          index: indexRoute.index || Number.MAX_INT,
          default: true,
          visible: indexRoute.visible || is.undefined(indexRoute.visible)
        })
      }

      if (route.childRoutes) {
        route.childRoutes.forEach((item) => {
          items.push({
            to: item.path ? item.path : routepath,
            title: item.title,
            icon: item.icon,
            scope: route.path === '/' ? item.scope : route.scope,
            isControl: !!item.isControl,
            index: item.index || Number.MAX_INT,
            visible: item.visible || is.undefined(item.visible)
          })
        })
      }
      if (items.length === 0) {
        this.childRoutes = null
        return
      }
      this.childRoutes = items.sort((a, b) => a.index - b.index)
    }

    render() {
      // eslint-disable-next-line react/jsx-filename-extension
      return <ComposedComponent {...this.props} />
    }
  }
}

export default withChildRoutes
