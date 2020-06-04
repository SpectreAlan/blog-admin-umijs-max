import axios from 'axios'
import router from '@/router'
import defaultSetting from '@/settings'
import { Message } from 'element-ui'
class Request {
  constructor() {
    this.instance = axios.create({
      baseURL: defaultSetting.proxy.name,
      timeout: 5000
    })
    this.instance.interceptors.request.use(
      config => {
        if (sessionStorage.getItem('req_' + config.baseURL + config.url)) {
          const msg = '请求已发出，请勿重复点击'
          Message({
            message: msg,
            type: 'info',
            duration: 1000
          })
          return Promise.reject(msg)
        }
        sessionStorage.setItem('req_' + config.baseURL + config.url, 'stop')
        return config
      },
      error => {
        return Promise.reject(error)
      }
    )
    this.instance.interceptors.response.use(
      response => {
        sessionStorage.removeItem('req_' + response.config.url)
        const res = response.data
        if (res.code !== 1) {
          if (res.code === 40000) {
            router.push({ path: '/login' })
          }
          Message({
            message: res.msg || '服务器响应数据为空',
            type: 'error',
            duration: 5 * 1000
          })
        } else {
          return res
        }
      },
      (error) => {
        sessionStorage.removeItem('req_' + error.config.url)
        console.log(error)
        return Promise.reject(error)
      }
    )
  }
  post(url, params = {},) {
    return new Promise((resolve, reject) => {
      this.instance
        .post(url, params, { headers: {
          'Content-Type': 'application/json;charset=utf-8' }
        })
        .then((res) => {
          resolve(res.data)
        })
        .catch((error) => {
          reject(error)
        })
    })
  }
}

export default new Request()
