import React from 'react'
import T from 'prop-types'
import moment from 'moment'
import pad from '../utils/pad'
import ticker from '../utils/ticker'

const getFormatTime = (d, format) => {
  const h = pad(Math.floor(d.asHours()), 2)
  const m = pad(d.minutes(), 2)
  const s = pad(d.seconds(), 2)
  const r = [h, m, s].join(':')
  if (!format) return r
  return format.replace('HH', h).replace('mm', m).replace('ss', s)
}

/* eslint-disable react/require-default-props */
export default class CountDown extends React.Component {
  static propTypes = {
    target: T.number,
    onReachTarget: T.func,
    format: T.any,
    reachedText: T.string,
    children: T.object,
    renderChildren: T.func,
  }

  state = {
    tick: Date.now(),
    dispatchedReachEvent: false,
    lastTarget: this.props.target,
  }

  componentDidMount() {
    this.mounted = true
    const { lastTarget, tick } = this.state
    if (lastTarget > tick) {
      ticker.register(this, this.onTick)
      this.state.dispatchedReachEvent = false
    }
  }

  componentWillUnmount() {
    this.mounted = false
    ticker.unregister(this)
  }

  onReachTarget() {
    ticker.unregister(this)
    if (this.props.onReachTarget) {
      setTimeout(this.props.onReachTarget, 0)
    }
  }

  onTick = (tick) => {
    if (this.mounted) this.setState({ tick })
  }

  duration = (from, to) => {
    if (from >= to) {
      if (!this.state.dispatchedReachEvent) {
        this.state.dispatchedReachEvent = true
        this.onReachTarget()
      }
      return this.props.reachedText || '-'
    }
    const d = moment.duration(to - from)
    const { format } = this.props
    if (!format || typeof format === 'string') {
      return getFormatTime(d, format)
    }
    const { day } = format
    if (day) {
      const { than = 2 } = day
      const days = d.asDays()
      if (days >= than) {
        return day.format.replace('DD', Math.floor(days))
      }
      return getFormatTime(d, format.default)
    }
    return ''
  }

  render() {
    const { target, renderChildren, children } = this.props
    const { tick } = this.state
    if (this.state.lastTarget !== target) {
      this.state.lastTarget = target
      if (target > tick) {
        ticker.register(this, this.onTick)
        this.state.dispatchedReachEvent = false
      }
    }
    if (!target) return null
    const reached = tick >= target
    const c = renderChildren ? renderChildren(reached) : (!reached && children)
    if (c) return <span>{this.duration(tick, target)}{c}</span>
    return <span>{this.duration(tick, target)}</span>
  }
}
