import axios from 'axios'
import EventBus from './event'

// 创建新的axios实例
const instance = axios.create({})

// 中间件，每次请求都会走到这里
instance.interceptors.response.use(
  function (response) {
    // console.log('@@@', response)

    if (response.status === 200) {
      // 代表没有登录
      if (response.data.code === 401) {
        // 将页面直接跳转到 /login
        // window.location.href = '/login'
        EventBus.emit('global_not_login', response.data.msg)
        return Promise.reject('没有登录状态')
      }

      // 业务发生错误   全局错误处理
      if (response.data.code !== 0 && response.data.code !== 401) {
        // console.log('注册失败', response)

        // 发布事件
        EventBus.emit('global_error_tips', response.data.msg)
      }
    } else {
      // 后台可能有问题(后台的锅)
      EventBus.emit('global_error_tips', response.data.message)
    }
    return response
  },
  function (error) {
    EventBus.emit('global_error_tips', error.response.data.message)
    return Promise.reject(error)
  }
)

export default instance
