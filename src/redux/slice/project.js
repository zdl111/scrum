import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from '../../util/http.js'
import { set_kanban_data } from './drop.js'
import { set_current_project } from './kanban.js'

const initialState = {
  list: [], //项目列表
  current_page: 1,
  total: 0,
  loading: false,
  organizations: [],
  users: [],
  task_types: [],
  project_modal: {
    show: false,
    type: 'create',
    id: ''
  },
  search_query: {}
}

export const getProjectListAsync = createAsyncThunk(
  'project/get_project_list', //自己定义的action
  async (data, store) => {
    const state = store.getState()
    console.log('sssssss', state)
    const skip = (state.project.current_page - 1) * 10
    // console.log('skip', skip)
    const search_query = state.project.search_query

    const response = await axios.post('/api/projects/search', {
      ...search_query,
      skip
    })
    return response.data
  }
)

export const getUsersAsync = createAsyncThunk('project/get_users', async () => {
  const response = await axios.get('/api/users')
  return response.data
})

export const getOrgsAsync = createAsyncThunk('project/get_orgs', async () => {
  const response = await axios.get('/api/organization')
  // console.log('response', response.data)
  return response.data
})

export const getTaskTypeAsync = createAsyncThunk(
  'project/get_task_types',
  async () => {
    const response = await axios.get('/api/task/type_list')
    return response.data
  }
)

// 更新数据
export const get_project_async = createAsyncThunk(
  'project/get',
  async (action, state) => {
    // 根据id获取单一的project对象
    const res = await axios.get(`/api/project/${action}`)
    const kanban = res.data.data.kanban

    // 修改store中的数据，定义kanban的数据   drop slice
    state.dispatch(set_kanban_data(kanban))
    // 设置当前的project对象
    state.dispatch(set_current_project(res.data.data))
  }
)

export const projectSlice = createSlice({
  name: 'project',
  initialState,
  reducers: {
    set_project_modal: (state, action) => {
      // state.modal_show = action.payload

      state.project_modal = {
        ...state.project_modal,
        ...action.payload
      }
    },
    change_list: (state, action) => {
      const { _id, data } = action.payload
      const index = state.list.findIndex((item) => {
        // console.log('item', item)
        return item._id === _id
      })
      // console.log('data', data)
      state.list[index] = data
    },
    set_search_query: (state, action) => {
      state.search_query = action.payload
    },
    set_current_page: (state, action) => {
      state.current_page = action.payload
    }
  },
  extraReducers: {
    [getProjectListAsync.pending]: (state, res) => {
      state.loading = true
    },
    [getProjectListAsync.fulfilled]: (state, res) => {
      // console.log('fffffffffffff', res)
      // 根据后台返回数据字段决定
      const data = res.payload.data.data
      const total = res.payload.data.total

      // 跟后台有关，可能没有收藏这个字段
      data.forEach((element) => {
        if (typeof element.collect === 'undefined') {
          element.collect = false
        }
      })
      state.list = data
      state.loading = false
      state.total = total
    },
    [getOrgsAsync.fulfilled]: (state, res) => {
      // console.log('res', res)
      const data = res.payload.data
      state.organizations = data
    },
    [getUsersAsync.fulfilled]: (state, res) => {
      const data = res.payload.data
      state.users = data
    },
    [getTaskTypeAsync.fulfilled]: (state, res) => {
      const data = res.payload.data
      state.task_types = data
    }
  }
})

export const {
  set_project_modal,
  set_search_query,
  set_current_page,
  change_list
} = projectSlice.actions

export const select_project_modal = (state) => {
  return state.project.project_modal
}

export const select_project_list = (state) => {
  return state.project.list
}

export const select_users = (state) => {
  return state.project.users
}

export const select_orgs = (state) => {
  return state.project.organizations
}

export const select_task_types = (state) => {
  return state.project.task_types
}

export const select_project_list_data = (state) => {
  return {
    list: state.project.list,
    total: state.project.total,
    current_page: state.project.current_page
  }
}

export default projectSlice.reducer
