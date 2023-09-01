import { Form, Input, Modal, Select } from 'antd'
import { useSelector, useDispatch } from 'react-redux'
import {
  select_epic_list,
  select_task_modal_status,
  set_task_modal
} from '../../redux/slice/kanban'
import { useEffect } from 'react'
import { select_task_types, select_users } from '../../redux/slice/project'
import {
  add_task,
  kanban_selector,
  update_kanban_async,
  update_task
} from '../../redux/slice/drop'

function CreateTaskModal() {
  const dispatch = useDispatch()
  const { type, kanban_key, task_id, show } = useSelector(
    select_task_modal_status
  )
  const epic_list = useSelector(select_epic_list) || []
  // console.log('epic_list', epic_list)

  const kanban_data = useSelector(kanban_selector)

  // options下拉框
  const task_types = useSelector(select_task_types)
  const users = useSelector(select_users)

  const [form] = Form.useForm()

  useEffect(() => {
    if (type === 'edit' && show) {
      const data = kanban_data
      const kanban = data.find((item) => {
        return item.kanban_key === kanban_key
      })

      const task_data = kanban.task

      const task = task_data.find((item) => {
        return item.task_id === task_id
      })

      // 设置表单
      form.setFieldsValue(task)
    }

    if (type === 'create' && show) {
      // 清理掉
      form.resetFields()
    }
  }, [show])

  async function onOk() {
    // 表单校验
    const form_data = await form.validateFields()
    if (form_data) {
      // 创建
      if (type === 'create') {
        // 创建的时候给task一个随机的id
        form_data.task_id = Math.random().toString(32).substring(2)
        dispatch(
          add_task({
            kanban_key,
            task: form_data
          })
        )
        // 更新kanban
        dispatch(update_kanban_async())
      }

      // 编辑
      if (type === 'edit') {
        dispatch(
          update_task({
            task: form_data,
            task_id,
            kanban_key
          })
        )
      }

      // 更新kanban
      dispatch(update_kanban_async())
    }

    dispatch(
      set_task_modal({
        show: false
      })
    )
  }

  function onCancel() {
    dispatch(
      set_task_modal({
        show: false
      })
    )
  }

  function render_task_options(arr) {
    // console.log('arr', arr)
    return arr.map((item) => {
      return (
        <Select.Option key={item.type} value={item.type}>
          {item.name}
        </Select.Option>
      )
    })
  }

  function render_users_options(arr) {
    return arr.map((item) => {
      return (
        <Select.Option key={item.username} value={item.username}>
          {item.username}
        </Select.Option>
      )
    })
  }

  const epic_options = epic_list.map((key) => {
    return {
      value: key,
      label: key
    }
  })

  return (
    <Modal
      title={type === 'create' ? '创建任务' : '编辑任务'}
      open={show}
      okText={type === 'create' ? '创建任务' : '修改'}
      onOk={onOk}
      onCancel={onCancel}
    >
      <Form name="basic" autoComplete="off" form={form}>
        <Form.Item
          label="任务名称"
          name="name"
          rules={[{ required: true, message: '请输入任务名称' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="任务类型"
          name="type"
          rules={[{ required: true, message: '请选择任务类型' }]}
        >
          <Select>{render_task_options(task_types)}</Select>
        </Form.Item>
        <Form.Item
          label="负责人"
          name="owner"
          rules={[{ required: true, message: '请选择负责人' }]}
        >
          <Select>{render_users_options(users)}</Select>
        </Form.Item>
        <Form.Item label="epic" name="epic">
          <Select className="search_wrap_select" options={epic_options} />
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default CreateTaskModal
