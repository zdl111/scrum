import { Button, Pagination, Space, Table } from 'antd'
import dayjs from 'dayjs'
import { useSelector, useDispatch } from 'react-redux'
import { NavLink } from 'react-router-dom'
import {
  change_list,
  getProjectListAsync,
  select_project_list,
  select_project_list_data,
  set_current_page,
  set_project_modal
} from '../../redux/slice/project'
import { store } from '../../redux/store.js'
import axios from '../../util/http.js'

function hand_collect_click(record) {
  // console.log('record', record)

  const data = {
    ...record,
    collect: !record.collect
  }
  // console.log('data', data)

  const dispatch = store.dispatch
  dispatch(
    change_list({
      _id: record._id,
      data
    })
  )
  // 更新服务器同步
  axios.put(`/api/projects/${record._id}`, {
    collect: data.collect
  })
}

function edit_click(id) {
  store.dispatch(
    set_project_modal({
      show: true,
      type: 'edit',
      id
    })
  )
}

async function del_click(id) {
  await axios.delete(`/api/projects/${id}`)
  store.dispatch(getProjectListAsync())
}

const colums = [
  {
    title: '收藏',
    dataIndex: 'collect',
    key: 'collect',
    render: (text, record) => {
      return (
        <div
          onClick={() => {
            hand_collect_click(record)
          }}
          className="iconfont icon-shoucang shoucang-item"
          style={{ color: text ? '#dfd50c' : '' }}
        ></div>
      )
    },
    width: '10%'
  },
  {
    title: '项目名称',
    dataIndex: 'name',
    key: 'name',
    render: (text, data) => {
      // console.log(text, data)
      return <NavLink to={`/project/${data._id}/kanban`}>{text}</NavLink>
    },
    sorter: (a, b) => a.title - b.title,
    width: '30%'
  },
  {
    title: '部门',
    dataIndex: 'organization',
    key: 'organization',
    width: '15%'
  },
  {
    title: '负责人',
    dataIndex: 'owner',
    key: 'owner',
    render: (text) => <div>{text}</div>,
    width: '15%'
  },
  {
    title: '创建时间',
    key: 'created',
    dataIndex: 'created',
    render: (_, record) => (
      <Space size="middle">
        <div>{dayjs(record.created).format('DD/MM/YYYY')}</div>
      </Space>
    )
  },
  {
    title: '操作',
    key: 'created',
    dataIndex: 'created',
    render: (_, record) => (
      <>
        <Button
          type="primary"
          onClick={() => {
            edit_click(record._id)
          }}
        >
          编辑
        </Button>
        <Button
          type="danger"
          onClick={() => {
            del_click(record._id)
          }}
        >
          删除
        </Button>
      </>
    )
  }
]

function gen_data(list) {
  return list.map((item) => {
    return {
      _id: item._id,
      collect: false,
      name: item.name,
      organization: item.organization,
      owner: item.owner,
      created: item.created
    }
  })
}

function ProjectTable() {
  // redux
  const dispatch = useDispatch()

  // 性能优化点
  let data = useSelector(select_project_list_data)

  function onChange(page) {
    // console.log('page', page)
    dispatch(set_current_page(page))
    dispatch(getProjectListAsync())
  }

  return (
    <>
      <Table
        className="project_table_css"
        pagination={false}
        dataSource={data.list}
        columns={colums}
      />
      <Pagination
        onChange={onChange}
        total={data.total}
        current={data.current_page}
      />
    </>
  )
}

export default ProjectTable
