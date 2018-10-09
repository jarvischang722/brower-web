import React from 'react'
import T from 'prop-types'
import { Tag } from 'antd'

export default class TagInput extends React.Component {
  static propTypes = {
    parentIns: T.object.isRequired
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

  handleInputChange(evt) {
    this.props.parentIns.setState({ input: evt.target.value })
  }

  handleInputKeyDown(evt) {
    if (evt.keyCode === 13) {
      const { value } = evt.target
      this.props.parentIns.setState(state => ({
        items: [...state.items, value],
        input: ''
      }))
    }

    if (
      this.props.parentIns.state.items.length &&
      evt.keyCode === 8 &&
      !this.props.parentIns.state.input.length
    ) {
      this.props.parentIns.setState(state => ({
        items: state.items.slice(0, state.items.length - 1)
      }))
    }
  }

  handleRemoveItem(index) {
    return () => {
      this.props.parentIns.setState(state => ({
        items: state.items.filter((item, i) => i !== index)
      }))
    }
  }

  getStyles() {
    const styles = {
      container: {
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
    return (
      <label>
        <ul style={styles.container}>
          {this.props.parentIns.state.items.map((item, idx) => (
            <li key={idx} afterClose={() => this.handleTagClose(idx)} style={styles.items}>
              <Tag closable key={idx}>
                {item}
              </Tag>
            </li>
          ))}
          <input
            style={styles.input}
            value={this.props.parentIns.state.input}
            onChange={this.handleInputChange}
            onKeyDown={this.handleInputKeyDown} />
        </ul>
      </label>
    )
  }
}
