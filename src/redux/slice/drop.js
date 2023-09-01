import { createAsyncThunk, createSlice, current } from '@reduxjs/toolkit'
import axios from '../../util/http.js'

const initialState = {
  // 当前页面的kanban数据
  kanban_data: [],
  // active状态
  project_id: ''
}

// 把开始的元素删除，然后插入到结束位置的元素上，实现换位
function reorderList(list, startIndex, endIndex) {
  const result = list
  const [removed] = result.splice(startIndex, 1)
  result.splice(endIndex, 0, removed)
  return result
}

export const update_kanban_async = createAsyncThunk(
  'drop/update',
  async (action, state) => {
    // console.log('state', state)
    const store = state.getState()
    const kanban_data = store.drop.kanban_data
    const project_id = store.drop.project_id
    const res = await axios.put(
      `/api/projects/${project_id}/kanban`,
      kanban_data
    )
  }
)

export const DropSlice = createSlice({
  name: 'drop',
  initialState,
  reducers: {
    set_project_id: (state, action) => {
      // console.log('action.payload', action.payload)
      state.project_id = action.payload
    },
    set_kanban_data: (state, action) => {
      // console.log('action.payload', action.payload)
      state.kanban_data = action.payload
    },
    kanban_order: (state, action) => {
      // 移动的类型 kanban
      // 下标从哪里移动到了哪里？
      reorderList(
        state.kanban_data,
        action.payload.source,
        action.payload.destination
      )
    },
    task_same_order: (state, action) => {
      // 移动的类型 task
      // 下标到了移动到了哪里
      // 同一个kanban
      const kanban_data = state.kanban_data

      const kanban = kanban_data.find((item) => {
        return item.kanban_key === action.payload.kanban_key
      })

      console.log('kanban', current(kanban))

      let task_arr = kanban.task

      reorderList(task_arr, action.payload.source, action.payload.destination)
    },
    task_diff_order: (state, action) => {
      // 从哪个面板到哪个面板
      // 从那个面板的index 到了 哪个面板的index
      const kanban_data = state.kanban_data

      const source_kanban = kanban_data.find((item) => {
        return item.kanban_key === action.payload.source_kanban_key
      })

      const destination_kanban = kanban_data.find((item) => {
        return item.kanban_key === action.payload.destination_kanban_key
      })

      const source_task = source_kanban.task
      const destination_task = destination_kanban.task

      const result_socurce = source_task[action.payload.source]
      source_task.splice(action.payload.source, 1)
      destination_task.splice(action.payload.destination, 0, result_socurce)
    },
    add_kanban: (state, action) => {
      // immer
      const kanban_key = action.payload.kanban_key
      state.kanban_data.push({
        kanban_key,
        task: []
      })
    },
    add_task: (state, action) => {
      const kanban_key = action.payload.kanban_key
      const task_data = action.payload.task

      const kanban = state.kanban_data.find((item) => {
        return item.kanban_key === kanban_key
      })

      kanban.task.push(task_data)
    },
    update_task: (state, action) => {
      const kanban_key = action.payload.kanban_key
      let task_data = action.payload.task
      const task_id = action.payload.task_id

      const kanban = state.kanban_data.find((item) => {
        return item.kanban_key === kanban_key
      })

      const index = kanban.task.findIndex((item) => {
        return item.task_id === task_id
      })

      // 补充id
      task_data.task_id = kanban.task.task_id

      kanban.task[index] = task_data
    }
  }
})

export const kanban_selector = (state) => {
  return state.drop.kanban_data
}

export const {
  set_project_id,
  set_kanban_data,
  kanban_order,
  task_same_order,
  task_diff_order,
  add_kanban,
  add_task,
  update_task
} = DropSlice.actions
export default DropSlice.reducer
