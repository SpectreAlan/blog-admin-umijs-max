import Request from '@/utils/request'

export function list(data) {
  return Request.post('/role/list', data)
}

export function edit(data) {
  return Request.post('/role/edit', data)
}

export function del(data) {
  return Request.post('/role/del', data)
}

export function add(data) {
  return Request.post('/role/add', data)
}
