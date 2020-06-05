import Request from '@/utils/request'

export function list(data) {
  return Request.post('/article/list', data)
}

export function status(data) {
  return Request.post('/article/status', data)
}

export function del(data) {
  return Request.post('/article/del', data)
}

