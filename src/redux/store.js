import { configureStore } from '@reduxjs/toolkit'
import dropReducer from './slice/drop.js'
import projectReducer from './slice/project.js'
import kanbanReducer from './slice/kanban.js'
import epicReducer from './slice/epic.js'
import loginReducer from './slice/login.js'

export const store = configureStore({
  reducer: {
    drop: dropReducer,
    project: projectReducer,
    kanban: kanbanReducer,
    epic: epicReducer,
    login: loginReducer
  }
})
