import { Button, Modal, Space } from 'antd'

// 任务删除
export default function DeleteAlert() {
  const DeleteText = () => {
    Modal.confirm({
      okText: '确定',
      cancelText: '取消',
      title: '确定删除该项目组吗?',
      onOk() {}
    })
  }

  return (
    <Space>
      <Button onClick={DeleteText}>删除</Button>
    </Space>
  )
}
