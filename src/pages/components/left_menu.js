import { Menu } from 'antd'
import { useEffect, useState } from 'react'
import { NavLink, useLocation, useNavigate, useParams } from 'react-router-dom'

function LeftMenu() {
  const location = useLocation()
  // console.log('location', location)
  const [active, set_active] = useState('')
  const params = useParams()
  const navigate = useNavigate()

  // 经典错误 路由跳转执行函数，set_active又会再次执行函数 进入无限循环
  const pathname = location.pathname
  const key_arr = pathname.split('/')
  // console.log(key_arr)
  // set_active(key_arr[3])

  useEffect(() => {
    set_active(key_arr[3])
  }, [])

  const items = [
    {
      label: '看板',
      key: 'kanban'
    },
    {
      label: '任务组',
      key: 'epic'
    }
  ]

  function menu_click(e) {
    const key = e.key
    set_active(key)
    const id = params.id
    navigate(`/project/${id}/${key}`)
  }

  // console.log('active121212', active)
  return (
    <div className="left_menu">
      <Menu
        selectedKeys={active}
        mode={'inline'}
        items={items}
        onClick={menu_click}
      ></Menu>
    </div>
  )
}

export default LeftMenu
