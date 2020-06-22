import Request from '@/utils/request'

export function list(data) {
  return Request.post('/role/search', data)
}

export function edit(data) {
  return Request.post('/role/edit', data)
}

export function status(data) {
  return Request.post('/role/status', data)
}

export function del(data) {
  return Request.post('/role/del', data)
}

export function add(data) {
  return Request.post('/role/add', data)
}
