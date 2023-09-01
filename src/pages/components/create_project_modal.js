import { Modal, Form, Input, Select } from 'antd'
import { useSelector, useDispatch } from 'react-redux'
import {
  getProjectListAsync,
  select_orgs,
  select_project_list,
  select_project_modal,
  select_users,
  set_project_modal
} from '../../redux/slice/project'
import { useEffect } from 'react'
import axios from '../../util/http.js'

function CreateProjectModal() {
  const dispatch = useDispatch()
  const modal_data = useSelector(select_project_modal)
  const project_list = useSelector(select_project_list)

  const show = modal_data.show
  const type = modal_data.type
  const project_id = modal_data.id

  const [form] = Form.useForm()

  const orgs = useSelector(select_orgs)
  const users = useSelector(select_users)

  useEffect(() => {
    if (type === 'edit') {
      const data = project_list.find((item) => {
        return (item._id = project_id)
      })

      const form_data = {
        name: data.name,
        organization: data.organization,
        owner: data.owner
      }

      form.setFieldValue(form_data)
    }
  }, [show])

  async function onOk() {
    const form_data = await form.validateFields()
    if (form_data) {
      if (type === 'create') {
        const res = await axios.post('/api/projects', form_data)
      }
      if (type === 'edit') {
        const res = await axios.put(`/api/projects/${project_id}`, form_data)
      }

      dispatch(
        set_project_modal({
          show: false
        })
      )
      dispatch(getProjectListAsync())
    }
  }

  function onCancel() {
    dispatch(
      set_project_modal({
        show: false
      })
    )
  }

  function render_orgs_options(arr) {
    return arr.map((item) => {
      return <Select.Option value={item.name}>{item.name}</Select.Option>
    })
  }

  function render_users_options(arr) {
    return arr.map((item) => {
      return (
        <Select.Option value={item.username}>{item.username}</Select.Option>
      )
    })
  }

  return (
    <Modal
      title={type === 'edit' ? '编辑项目' : '创建项目'}
      open={show}
      okText={type === 'edit' ? '编辑项目' : '创建项目'}
      onOk={onOk}
      onCancel={onCancel}
    >
      <Form name="basic" autoComplete="off" form={form}>
        <Form.Item
          label="项目名称"
          name="name"
          rules={[{ required: true, message: '请输入项目名称' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="所在部门"
          name="organization"
          rules={[{ required: true, message: '请选择部门' }]}
        >
          <Select>{render_orgs_options(orgs)}</Select>
        </Form.Item>
        <Form.Item
          label="负责人"
          name="owner"
          rules={[{ required: true, message: '请选择负责人' }]}
        >
          <Select>{render_users_options(users)}</Select>
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default CreateProjectModal
