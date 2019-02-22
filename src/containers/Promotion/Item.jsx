import React from 'react'
import T from 'prop-types'
import { Draggable } from 'react-beautiful-dnd'
import url from 'url'
import api from '../../utils/api'

export default class Item extends React.Component {
  static propTypes = {
    item: T.object.isRequired,
    index: T.number.isRequired
  }

  static state = {
    imgSrc: ''
  }

  getItemStyle(isDragging, draggableStyle) {
    const grid = 8
    return {
      // some basic styles to make the items look a bit nicer
      userSelect: 'none',
      margin: `0 0 ${grid}px 0`,
      // change background colour if dragging
      background: isDragging ? 'rgb(120, 147, 162)' : '#7bafcc',
      color: '#FFFFFF',
      fontSize: '1.5em',
      width: '80%',
      height: '100px',
      cursor: 'move',
      // styles we need to apply on draggables
      ...draggableStyle
    }
  }

  getRodGridStyle() {
    return {
      display: 'grid',
      gridTemplateColumns: '150px 150px 150px',
      paddingTop: '10px'
    }
  }

  render() {
    const { item, index } = this.props
    const imgSrc = `${url.resolve(
      api.basename,
      `upload/icon/${this.props.item.id}.png`
    )}?t=${Date.now()}`
    return (
      <Draggable key={item.id} draggableId={item.id} index={index}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            style={this.getItemStyle(snapshot.isDragging, provided.draggableProps.style)}>
            <div style={this.getRodGridStyle()}>
              <div>
                <img alt="" src={imgSrc} width="84" height="84" />
              </div>
              <div>{item.name}</div>
            </div>
          </div>
        )}
      </Draggable>
    )
  }
}
