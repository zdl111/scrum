import { DragDropContext } from 'react-beautiful-dnd'
import { Droppable } from 'react-beautiful-dnd'
import { Draggable } from 'react-beautiful-dnd'
import { useSelector } from 'react-redux'
import { useDispatch } from 'react-redux'
import {
  kanban_selector,
  kanban_order,
  task_same_order,
  task_diff_order,
  update_kanban_async,
  add_kanban
} from '../../../redux/slice/drop'
import '../../css/drop.css'
import TaskDrop from './task_drop'
import { Button, Input } from 'antd'
import { set_task_modal } from '../../../redux/slice/kanban'
import { useParams } from 'react-router-dom'
import { useEffect, useRef } from 'react'

function reorderList(list, startIndex, endIndex) {
  const result = Array.from(list)
  // debugger
  const [removed] = result.splice(startIndex, 1)
  // debugger
  result.splice(endIndex, 0, removed)
  // debugger
  return result
}

function DropCp() {
  const drag_data = useSelector(kanban_selector)
  const dispatch = useDispatch()
  const params = useParams()
  const data = useRef()

  useEffect(() => {
    if (!data.current) {
      data.current = true
      return
    }
  }, [drag_data])

  function onDragEnd(result) {
    console.log('result', result)

    if (!result.destination) {
      return
    }

    if (result.type === 'kanban') {
      dispatch(
        kanban_order({
          source: result.source.index,
          destination: result.destination.index
        })
      )

      // kanban的数据和服务器进行同步   更新看板
      dispatch(update_kanban_async())
    }

    // task类型
    if (result.type === 'task') {
      // 在同一个面板移动
      if (result.destination.droppableId === result.source.droppableId) {
        dispatch(
          task_same_order({
            kanban_key: result.destination.droppableId,
            source: result.source.index,
            destination: result.destination.index
          })
        )

        // kanban的数据和服务器进行同步
        dispatch(update_kanban_async())
      } else {
        // 在不同面板移动

        dispatch(
          task_diff_order({
            source_kanban_key: result.source.droppableId,
            destination_kanban_key: result.destination.droppableId,
            source: result.source.index,
            destination: result.destination.index
          })
        )

        // kanban的数据和服务器进行同步
        dispatch(update_kanban_async())
      }
    }
  }

  function input_keydown(e) {
    const value = e.target.value.trim()
    if (!value) {
      return
    }
    dispatch(
      add_kanban({
        kanban_key: value
      })
    )
    dispatch(update_kanban_async())
  }

  function new_task_click(kanban_key) {
    dispatch(
      set_task_modal({
        show: true,
        kanban_key,
        type: 'create'
      })
    )
  }

  return (
    <DragDropContext onDragEnd={onDragEnd} className="drag_container">
      <Droppable
        direction="horizontal"
        droppableId="droppable-xxx"
        type="kanban"
      >
        {(provided, snapshot) => {
          return (
            <div
              className="kanban_drop_wrap"
              ref={provided.innerRef}
              {...provided.droppableProps}
            >
              {drag_data.map((item, index) => {
                return (
                  <>
                    <Draggable
                      key={item.kanban_key}
                      draggableId={item.kanban_key}
                      index={index}
                    >
                      {(provided, snapshot) => {
                        return (
                          <div
                            className="kanban_drag_wrap"
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                          >
                            <h1>{item.kanban_key}</h1>
                            <TaskDrop task={item} />
                            <Button
                              className="new_task_btn"
                              onClick={() => {
                                new_task_click(item.kanban_key)
                              }}
                              type="primary"
                              ghost
                            >
                              新建task
                            </Button>
                          </div>
                        )
                      }}
                    </Draggable>
                  </>
                )
              })}
              {provided.placeholder}
            </div>
          )
        }}
      </Droppable>
      <div className="kanban_drag_wrap">
        <Input onPressEnter={input_keydown} placeholder="新建看板名称" />
      </div>
    </DragDropContext>
  )
}

export default DropCp
