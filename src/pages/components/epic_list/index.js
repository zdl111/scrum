import { List } from 'antd'
import { useSelector } from 'react-redux'
import { select_epic_list } from '../../../redux/slice/kanban'
import DeleteAlert from './delete_alert'
import {
  createSearchParams,
  useLocation,
  useNavigate,
  useParams
} from 'react-router-dom'

export default function EpicList() {
  const epic_list = useSelector(select_epic_list)
  // const location = useLocation()
  // console.log('location', location)
  const params = useParams()
  const navigate = useNavigate()

  function handle_click(epic) {
    navigate({
      pathname: `/project/${params.id}/kanban`,
      // 查询参数
      search: createSearchParams({
        epic
      }).toString()
    })
  }

  return (
    <List
      itemLayout="horizontal"
      dataSource={epic_list}
      renderItem={(item) => (
        <List.Item style={{ height: '135px' }}>
          <List.Item.Meta
            title={
              <div className="list_item_title">
                <div
                  onClick={() => {
                    handle_click(item)
                  }}
                  style={{ fontSize: '18px', color: 'black' }}
                >
                  {item}
                </div>
                <DeleteAlert></DeleteAlert>
              </div>
            }
            description={
              <div style={{ fontSize: '16px' }}>
                <div>开始时间：暂无</div>
                <div>结束时间：暂无</div>
              </div>
            }
          />
        </List.Item>
      )}
    />
  )
}
