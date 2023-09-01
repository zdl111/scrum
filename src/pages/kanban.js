import SearchForm from './components/search_form'
import DropCp from './components/drop'
import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { get_project_async } from '../redux/slice/project'
import { set_project_id } from '../redux/slice/drop'
import CreateTaskModal from './components/create_task_modal'
import { select_current_project } from '../redux/slice/kanban'

function Kanban() {
  const dispatch = useDispatch()
  const params = useParams()
  // console.log('params', params)
  const project_id = params.id
  const current_project = useSelector(select_current_project)

  useEffect(() => {
    // 发起请求  拉取kanban的最新数据
    dispatch(get_project_async(project_id))

    // project的激活状态保留  备用  以防万一   drop slice
    dispatch(set_project_id(project_id))
  }, [params.id]) // 依赖

  return (
    <div className="kanban_body">
      <div className="Kanban_title">
        <h1>{current_project.name}-研发看板</h1>
      </div>
      <div className="kanban_search_wrap">
        <SearchForm />
      </div>
      <div className="drop_wrap">
        <DropCp />
      </div>
      <CreateTaskModal />
    </div>
  )
}

export default Kanban
