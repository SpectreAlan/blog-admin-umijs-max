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

export function add(data) {
  return Request.post('/article/add', data)
}

export function edit(data) {
  return Request.post('/article/edit', data)
}

export function search(data) {
  return Request.post('/article/search', data)
}

export function tags(data) {
  return Request.post('/article/tags', data)
}
export function category(data) {
  return Request.post('/article/category', data)
}
