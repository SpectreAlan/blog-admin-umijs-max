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
        res.msg && Message({
          message: res.msg,
          type: res.code ? 'success' : 'error',
          duration: 5 * 1000
        })
        if (res.code) {
          if (res.code === 401) {
            router.push('/login')
          }
          return res
        } else {
          return Promise.reject(res.msg)
        }
      },
      (error) => {
        sessionStorage.removeItem('req_' + error.config.url)
        const res = error.response.data.error
        Message({
          message: res,
          type: 'error',
          duration: 5 * 1000
        })
        return Promise.reject(res)
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
  get(url) {
    return new Promise((resolve, reject) => {
      this.instance
        .get(url)
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
