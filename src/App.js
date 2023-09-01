import './App.css'
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import Login from './pages/login'
import Register from './pages/register'
import Layout from './pages/components/layout.js'
import Project from './pages/project.js'
import Kanban from './pages/kanban'
import Epic from './pages/epic'
import { notification } from 'antd'
import { useEffect } from 'react'
import EventBus from './util/event'
import { useDispatch } from 'react-redux'
import {
  getOrgsAsync,
  getProjectListAsync,
  getTaskTypeAsync,
  getUsersAsync
} from './redux/slice/project'

function App() {
  const dispatch = useDispatch()
  const [api, contextHolder] = notification.useNotification()
  const location = useLocation()
  const navigate = useNavigate()

  // 错误弹窗提示方法
  const openNotification = (msg) => {
    api.error({
      message: msg,
      placement: 'topRight'
    })
  }

  useEffect(() => {
    if (location.pathname === '/') {
      navigate('/project')
    }

    // 获取动态的列表数据
    dispatch(getUsersAsync())
    dispatch(getOrgsAsync())
    dispatch(getTaskTypeAsync())

    // 拉取项目列表
    dispatch(getProjectListAsync())

    // 没有登录
    EventBus.on('global_not_login', function (msg) {
      navigate('/login')
    })

    // 订阅
    EventBus.on('global_error_tips', function (msg) {
      // console.log('发生了错误')
      openNotification(msg)
    })
  }, [])

  return (
    <div className="App">
      {contextHolder}
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route element={<Layout />}>
          <Route path="/project" element={<Project />} />
          <Route path="/project/:id/kanban" element={<Kanban />} />
          <Route path="project/:id/epic" element={<Epic />} />
        </Route>
      </Routes>
    </div>
  )
}

export default App
