import axios from 'axios'
import qs from 'qs'
import { setToken } from '@/libs/util'
import { Message } from 'view-design'

class HttpRequest {
  constructor (baseUrl = baseURL) {
    this.baseUrl = baseUrl
    this.queue = {}
  }
  getInsideConfig () {
    const config = {
      baseURL: this.baseUrl,
      timeout: 10000
      // headers: {
      //   'Content-Type': 'application/json'
      // }
    }
    return config
  }
  destroy (url) {
    delete this.queue[url]
    // if (!Object.keys(this.queue).length) {
    //   Spin.hide()
    // }
  }
  interceptors (instance, url) {
    // 请求拦截
    // instance.interceptors.request.use(config => {
    // 添加全局的loading...
    // if (!Object.keys(this.queue).length) {
    // Spin.show() // 不建议开启，因为界面不友好
    // }
    // this.queue[url] = true
    // return config
    // }, error => {
    // return Promise.reject(error)
    // })
    // 响应拦截
    instance.interceptors.response.use(res => {
      // this.destroy(url)
      // 响应
      if (res.data) {
        if (typeof res.data === 'object') {
          // Server
          if ('errorcode' in res.data) {
            if (res.data.errorcode === 0) {
              // 请求成功
              return res.data.data
            }
            // 用户未登录
            if (res.data.errorcode === 3010) {
              setToken('')
            }
            Message.error(res.data.message)
            return Promise.reject(res.data)
          }
          // Blob
          if (res.data instanceof Blob) {
            return res
          }
        }
      }
      return Promise.reject(res)
    }, error => {
      // this.destroy(url)
      let errorInfo = error.response
      if (!errorInfo) {
        const { request: { statusText, status }, config } = JSON.parse(JSON.stringify(error))
        errorInfo = {
          statusText,
          status,
          request: { responseURL: config.url }
        }
      }
      // addErrorLog(errorInfo)
      Message.error(errorInfo.statusText || '连接超时，请检查网络！')
      return Promise.reject(errorInfo)
    })
  }
  request (options) {
    const instance = axios.create()
    options = Object.assign(this.getInsideConfig(), options)
    // POST 参数要格式化，否则服务端接收不到
    if (options && 'data' in options) {
      options.data = qs.stringify(options.data)
    }
    this.interceptors(instance, options.url)
    return instance(options)
  }
}
export default HttpRequest
