import { Button, Form, Input, Select } from 'antd'
import { useDispatch, useSelector } from 'react-redux'
import { select_users } from '../../../redux/slice/project'
import { useParams, useSearchParams } from 'react-router-dom'
import { useEffect } from 'react'
import { select_epic_list } from '../../../redux/slice/kanban'
import axios from '../../../util/http.js'
import { set_kanban_data } from '../../../redux/slice/drop'

function SearchForm() {
  const [form] = Form.useForm()
  const dispatch = useDispatch()
  const [search_params] = useSearchParams()
  // console.log('search_params', search_params)

  // 获取URl对象中epic的查询参数的值
  const search_epic = search_params.get('epic')
  // console.log('search_epic', search_epic)

  useEffect(() => {
    if (search_epic) {
      form.setFieldValue('epic', search_epic)
      // search({
      //   epic: search_epic
      // })

      // 这是什么问题？？？？
      setTimeout(() => {
        search({
          epic: search_epic
        })
      }, 500)
    }
  }, [])

  const users = useSelector(select_users)
  const params = useParams()
  const epic_list = useSelector(select_epic_list) || []
  // console.log('epic_list', epic_list)
  const project_id = params.id

  function render_users_options(arr) {
    return arr.map((item) => {
      return (
        <Select.Option value={item.username} key={item.username}>
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

  function reset() {
    form.resetFields()
  }

  // console.log('epic_list', epic_list)

  async function search(form_data) {
    const res = await axios.get(`/api/project/${project_id}`)
    // console.log('res', res)

    // console.log('form_data', form_data)

    let drop_data = res.data.data.kanban

    let fliter_drop_data = drop_data.map((item) => {
      let task_list = item.task
      task_list = task_list.filter((task) => {
        // console.log('task', task)
        let isName = true
        let isType = true
        let isOwner = true
        let isEpic = true

        if (form_data.name) {
          if (task.name.indexOf(form_data.name) < 0) {
            isName = false
          }
        }
        if (form_data.type) {
          if (task.type !== form_data.type) {
            isType = false
          }
        }
        if (form_data.owner) {
          if (task.owner !== form_data.owner) {
            isOwner = false
          }
        }
        if (form_data.epic) {
          if (task.epic !== form_data.epic) {
            isEpic = false
          }
        }

        return isName && isType && isOwner && isEpic
      })
      return {
        ...item,
        task: task_list
      }
    })
    dispatch(set_kanban_data(fliter_drop_data))
  }

  async function search_click() {
    const form_data = await form.validateFields()
    if (form_data) {
      await search(form_data)
    }
  }

  return (
    <Form layout="inline" form={form}>
      <Form.Item name="name" style={{ width: 200 }}>
        <Input placeholder={'任务名'} className="search_form_input" />
      </Form.Item>
      <Form.Item label="负责人" name="owner" style={{ width: 200 }}>
        <Select className="search_wrap_select">
          {render_users_options(users)}
        </Select>
      </Form.Item>
      <Form.Item label="任务类型" name="type" style={{ width: 200 }}>
        <Select
          className="search_wrap_select"
          options={[
            { value: 'task', label: 'task' },
            { value: 'bug', label: 'bug' }
          ]}
        />
      </Form.Item>
      <Form.Item label="epic" name="epic" style={{ width: 200 }}>
        <Select className="search_wrap_select" options={epic_options} />
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

export default SearchForm
