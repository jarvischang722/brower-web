import React from 'react'
import T from 'prop-types'
import { connect } from 'react-redux'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import { PromotionActions } from '../../actions'
import Item from './Item'
import { message } from 'antd'

// a little function to help us with reordering the result
const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list)

  const [removed] = result.splice(startIndex, 1)
  result.splice(endIndex, 0, removed)
  return result
}

const getListStyle = isDraggingOver => ({
  // background: isDraggingOver ? 'lightblue' : 'lightgrey',
  display: 'grid',
  padding: 6,
  width: '100%'
})

@connect(
  null,
  {
    list: PromotionActions.actions.list,
    updateSort: PromotionActions.actions.updateSort
  }
)
export default class Edit extends React.Component {
  static propTypes = {
    list: T.func.isRequired,
    updateSort: T.func.isRequired
  }

  constructor(props) {
    super(props)
    this.onDragEnd = this.onDragEnd.bind(this)
  }

  state = {
    items: [],
    changedItems: []
  }

  componentDidMount() {
    this.getItems()
  }

  getItems() {
    this.props.list().then(response => {
      if (response) {
        const items = response.items
        this.setState({ items })
      }
    })
  }

  onDragEnd(result) {
    if (!result.destination) {
      return
    }
    const items = reorder(this.state.items, result.source.index, result.destination.index)
    const changedItems = this.compareItems(items, result.source.index, result.destination.index)
    this.setState(
      {
        items,
        changedItems
      },
      () => {
        this.doSave()
      }
    )
  }

  compareItems(items, srcIdx, destIdx) {
    const startIdx = srcIdx < destIdx ? srcIdx : destIdx
    const endIdx = srcIdx > destIdx ? srcIdx : destIdx
    const result = items.slice(startIdx, endIdx + 1)
    for (let i = 0; i < result.length; i++) {
      result[i].sort = startIdx + i
    }
    return result
  }

  doSave() {
    const { items } = this.state
    const postData = {
      agentSortList: items.map((d,idx) => ({
        userid: d.id,
        sort: idx
      }))
    }
    this.props.updateSort(postData).then(response => {
      if (response.isUpdated) {
        message.success('save success!')
      } else {
        message.error('save fail!')
      }
    })
  }

  render() {
    const { items } = this.state
    return (
      <DragDropContext onDragEnd={this.onDragEnd}>
        <Droppable droppableId="droppable">
          {(provided, snapshot) => (
            <div
              align="center"
              ref={provided.innerRef}
              style={getListStyle(snapshot.isDraggingOver)}
              {...provided.droppableProps}>
              {items.map((item, index) => (
                <Item item={item} index={index} />
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    )
  }
}
