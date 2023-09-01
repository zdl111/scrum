import { Button, Form, Input, Select } from 'antd'
import { useDispatch } from 'react-redux'
import {
  getProjectListAsync,
  select_orgs,
  select_users,
  set_current_page,
  set_search_query
} from '../../redux/slice/project'
import { useSelector } from 'react-redux'

function ProjectSearch() {
  const dispatch = useDispatch()
  const orgs = useSelector(select_orgs)
  const users = useSelector(select_users)
  const [form] = Form.useForm()

  async function search_click() {
    const form_data = await form.validateFields()
    console.log('form_data', form_data)
    if (form_data) {
      dispatch(set_search_query(form_data))
      dispatch(set_current_page(1))
      dispatch(getProjectListAsync())
    }
  }

  function reset() {
    form.resetFields()
  }

  function render_orgs_options(arr) {
    // console.log('arr', arr)
    return arr.map((item) => {
      return <Select.Option value={item.name}>{item.name}</Select.Option>
    })
  }

  function render_users_options(arr) {
    // console.log('arr', arr)
    return arr.map((item) => {
      return (
        <Select.Option value={item.username}> {item.username}</Select.Option>
      )
    })
  }

  return (
    <Form layout="inline" form={form}>
      <Form.Item name="name" style={{ width: 180 }}>
        <Input placeholder={'任务名'} />
      </Form.Item>
      <Form.Item label="部门" name="organization" style={{ width: 180 }}>
        <Select> {render_orgs_options(orgs)}</Select>
      </Form.Item>
      <Form.Item label="负责人" name="owner" style={{ width: 180 }}>
        <Select>{render_users_options(users)}</Select>
      </Form.Item>

      <Button onClick={reset} type="">
        重置
      </Button>
      <Button onClick={search_click} type="primary">
        查询
      </Button>
    </Form>
  )
}

export default ProjectSearch
