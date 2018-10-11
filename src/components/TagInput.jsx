import React from 'react'
import T from 'prop-types'
import { Tag } from 'antd'
import random from '../utils/random'

export default class TagInput extends React.Component {
  static propTypes = {
    parentIns: T.object.isRequired,
    onChange: T.func.isRequired,
    onDelete: T.func.isRequired,
    items: T.array
  }

  constructor(props) {
    super(props)

    this.state = {
      items: [],
      input: ''
    }

    this.handleInputChange = this.handleInputChange.bind(this)
    this.handleInputKeyDown = this.handleInputKeyDown.bind(this)
    this.handleRemoveItem = this.handleRemoveItem.bind(this)
  }

  componentWillMount() {
    this.setItems()
  }

  setItems() {
    let items = []
    if (!Array.isArray(this.props.items)) {
      items = this.props.items ? this.props.items.split(',') : []
    }
    items = this.setKey(items)
    this.state.items = items
  }

  setKey(items) {
    const itemList = items.filter(d => d !== null && d !== '')
    const newItems = itemList.map(val => ({ key: random(4), value: val }))
    return newItems
  }


  handleInputChange(evt) {
    this.setState({ input: evt.target.value })
  }

  handleInputKeyDown(evt) {
    if (evt.target.value === '') return

    if (evt.keyCode === 9 || evt.keyCode === 13) {
      const { value } = evt.target
      const allItems = [...this.state.items, { key: random(4), value }]
      this.setState({
        items: allItems,
        input: ''
      })
      this.props.onChange(allItems)
    }

    if (this.state.items.length && evt.keyCode === 8 && !this.state.input.length) {
      const items = this.state.items.slice(0, this.state.items.length - 1)
      this.setState({ items })
      this.props.onChange(items)
    }
  }

  handleRemoveItem(key) {
    this.setState({
      items: this.state.items.filter(item => item.key !== key)
    })
  }

  getStyles() {
    const styles = {
      container: {
        display: 'table',
        width: '170%',
        border: '1px solid #ddd',
        padding: '5px',
        borderRadius: '5px'
      },
      items: {
        display: 'inline-block',
        padding: '2px',
        borderRadius: '5px',
        marginRight: '5px',
        cursor: 'pointer'
      },
      input: {
        outline: 'none',
        border: 'none',
        fontSize: '14px',
        fontFamily: 'Helvetica, sans-serif'
      }
    }
    return styles
  }

  render() {
    const styles = this.getStyles()
    const { items } = this.state
    return (
      <label>
        <ul style={styles.container}>
          {items.map(item => (
            <Tag key={item.key} closable onClose={() => this.handleRemoveItem(item.key)}>
              {item.value}
            </Tag>
          ))}
          <input
            style={styles.input}
            value={this.state.input}
            onChange={this.handleInputChange}
            onKeyDown={this.handleInputKeyDown} />
        </ul>
      </label>
    )
  }
}
