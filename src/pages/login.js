import { useEffect, useRef, useState } from 'react'
import { Input, Form, Button, Divider, Menu } from 'antd'
import LoginWrap from './components/login_wrap'
import { Link } from 'react-router-dom'
import axios from '../util/http.js'
import { useNavigate } from 'react-router-dom'

// 账号登录
function LoginForm() {
  return (
    <>
      <Form.Item
        name="username"
        rules={[{ required: true, message: '请输入用户名' }]}
      >
        <Input type="text" id="username" placeholder={'用户名'} />
      </Form.Item>
      <Form.Item
        name="password"
        rules={[{ required: true, message: '请输入密码' }]}
      >
        <Input type="password" id="password" placeholder={'密码'} />
      </Form.Item>
    </>
  )
}

// 手机验证码
function LoginPhone() {
  // 验证码 默认60秒
  const TIME_COUNT = 60
  const [count, setCount] = useState(TIME_COUNT)
  // 记录时间的定时器
  const timerRef = useRef(null)

  const cutCount = () => {
    setCount((preState) => preState - 1)
  }

  const handleClick = () => {
    cutCount()
    timerRef.current = setInterval(cutCount, 1000)
  }

  useEffect(() => {
    if (count === 0) {
      clearInterval(timerRef.current)
      setCount(TIME_COUNT)
    }
  }, [count])

  return (
    <>
      <Form.Item
        name="username"
        rules={[{ required: true, message: '手机号码格式不正确' }]}
      >
        <Input type="text" id="username" placeholder={'请输入手机号'} />
      </Form.Item>
      <Form.Item
        name="password"
        rules={[{ required: true, message: '请输入验证码' }]}
      >
        <div className="identifing_wrap">
          <Input placeholder={'请输入验证码'} />
          <p
            className="identifing-p"
            onClick={count === TIME_COUNT ? handleClick : null}
          >
            {count === TIME_COUNT ? (
              <span>获取验证码</span>
            ) : (
              <span>{count + '秒后重发'}</span>
            )}
          </p>
        </div>
      </Form.Item>
    </>
  )
}

function Login() {
  // 根据flag的值来切换选项卡
  const [flag, setFlag] = useState('username')
  // active 代表选中的选项卡，值为username代表默认选中 '账号登录'
  const [active, set_active] = useState('username')

  const [form] = Form.useForm()
  const navigate = useNavigate()

  async function login_click() {
    // validateFields做表单校验的
    const form_data = await form.validateFields()

    if (form_data) {
      console.log(form_data)
      const res = await axios.post('/api/login', form_data)

      // console.log('res', res)
      if (res.data.code === 0) {
        navigate('/project')
      }
    }
  }

  const items = [
    {
      label: '账号登录',
      key: 'username'
    },
    {
      label: '手机验证',
      key: 'identifingcode'
    }
  ]

  function loginToggle(e) {
    // console.log('e', e)
    const key = e.key
    set_active(key)
    setFlag(key)
  }

  return (
    <LoginWrap>
      <Form form={form}>
        <Menu
          onClick={loginToggle}
          selectedKeys={active}
          // 当前选中的选项卡
          mode={'vertical'}
          // 横向
          items={items}
        ></Menu>
        <p className="login_box_p">登录界面</p>
        {flag === 'username' ? <LoginForm /> : <LoginPhone />}
        <Button onClick={login_click} className="login_button" type="primary">
          登录
        </Button>
        <Divider />
        <Link className="login_enroll" to="/register">
          没有账号?注册新账号
        </Link>
      </Form>
    </LoginWrap>
  )
}

export default Login
