import ProjectPopover from './projectPopover.js'
import UserPopover from './userPopover.js'
import { useNavigate } from 'react-router-dom'
import logo from '../../../static/logo.png'
import axios from '../../../util/http.js'

function Header() {
  const navigate = useNavigate()

  async function logout() {
    await axios.post('/api/logout')
    navigate('/login')
  }

  function home_click() {
    navigate('/project')
  }

  return (
    <div className="header_wrap_body">
      <button className="header_button" onClick={home_click}>
        <img className="header_logo" src={logo} alt=""></img>
        <h2>Jira Software</h2>
      </button>
      <ProjectPopover />
      <UserPopover />
      <div onClick={logout} className="header_login_out_btn">
        退出登录
      </div>
    </div>
  )
}

export default Header
