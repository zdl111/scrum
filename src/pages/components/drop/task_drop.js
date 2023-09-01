import { Button } from 'antd'
import { Droppable } from 'react-beautiful-dnd'
import { Draggable } from 'react-beautiful-dnd'
import classnames from 'classnames'
import { useDispatch } from 'react-redux'
import { set_task_modal } from '../../../redux/slice/kanban'

function TaskDrop(props) {
  const dispatch = useDispatch()
  const task = props.task
  const list = task.task
  // console.log('task', task)
  // console.log('list', list)
  // console.log('props', props)

  // let numPic = Math.floor(Math.random() * 4)
  // console.log('numPic', numPic)

  function new_task_click(kanban_key) {
    dispatch(
      set_task_modal({
        show: true,
        kanban_key,
        type: 'create'
      })
    )
  }

  function edit_task(kanban_key, task_id) {
    dispatch(
      set_task_modal({
        show: true,
        kanban_key,
        task_id,
        type: 'edit'
      })
    )
  }

  return (
    // 对于每一个进度模块内部来说也相当于一个Droppable,因为里面的每一个 task 任务都是一个可拖拽的小卡片也就是Draggable
    <Droppable droppableId={task.kanban_key} type="task">
      {(provided, snapshot) => (
        <div
          className="task_drop_wrap"
          ref={provided.innerRef}
          {...provided.droppableProps}
        >
          {list.map((item, index) => {
            // console.log(item, index)
            return (
              <Draggable
                key={`${task.kanban_key}_${item.name}`}
                draggableId={`${task.kanban_key}_${item.name}`}
                index={index}
              >
                {(provided, snapshot) => {
                  return (
                    <div
                      className="task_drag_wrap"
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      onClick={() => {
                        edit_task(task.kanban_key, item.task_id)
                      }}
                    >
                      <div className="task_card">
                        <div className="task_card_top">
                          <div className="task_head_picture" alt=""></div>
                          <p className="task_head-p">{item.name}</p>
                        </div>

                        <div className="task_card_bottom">
                          <div className="task_owner">{item.owner}</div>
                          <div
                            className={classnames({
                              new_task_type: true,
                              red: item.type === 'bug',
                              blue: item.type === 'task'
                            })}
                          >
                            <span className="task_type-span">{item.type}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                }}
              </Draggable>
            )
          })}

          {provided.placeholder}
        </div>
      )}
    </Droppable>
  )
}

export default TaskDrop
