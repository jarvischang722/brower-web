import React from 'react'

function withScripts(scripts) {
  return ComposedComponent => class WithScripts extends React.Component {
    state = {
      scripts: {
        ready: false,
        onReady: ::this.registOnReady,
      },
    }

    componentDidMount() {
      this.mounted = true
      const req = window.require
      const cb = (define) => {
        if (this.mounted) {
          const update = this.state.scripts
          update.ready = true
          update.define = define
          this.setState({ scripts: update })
          this.applyOnReady()
        }
      }
      if (typeof scripts === 'string') {
        req([scripts], cb)
      }
      if (scripts instanceof Array) {
        req(scripts, cb)
      } else if (scripts.main && scripts.deps) {
        req([scripts.main], () => {
          req(scripts.deps, cb)
        })
      }
    }

    componentWillUnmount() {
      this.mounted = false
    }

    registOnReady(callback) {
      if (typeof callback !== 'function') {
        throw new Error('callback should be function')
      }
      this.onReady = callback
      this.applyOnReady()
    }

    applyOnReady() {
      const { ready, define } = this.state.scripts
      if (ready && this.onReady && !this.onReadyPerformed) {
        this.onReadyPerformed = true
        this.onReady(define)
      }
    }

    render() {
      const props = {
        ...this.props,
        ...this.state,
      }

      // eslint-disable-next-line react/jsx-filename-extension
      return <ComposedComponent {...props} />
    }
  }
}

export default withScripts
