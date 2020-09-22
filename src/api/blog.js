import Request from '@/utils/request'

export function list(data) {
  return Request.post('/article/search', data)
}

export function del(data) {
  return Request.post('/article/del', data)
}

export function tags(data) {
  return Request.post('/tags/list', data)
}

export function category(data) {
  return Request.post('/article/category', data)
}
