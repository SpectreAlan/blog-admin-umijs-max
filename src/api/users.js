import Request from '@/utils/request'

export function list(data) {
  return Request.post('/users/search', data)
}

export function signup(data) {
  return Request.post('/users/add', data)
}

export function edit(data) {
  return Request.post('/users/edit', data)
}

export function del(data) {
  return Request.post('/users/del', data)
}

export function getRoles(data) {
  return Request.post('/role/search/all', data)
}
