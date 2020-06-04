import Request from '@/utils/request'

export function list(data) {
  return Request.post('/menu/list', data)
}

export function edit(data) {
  return Request.post('/menu/edit', data)
}

export function del(data) {
  return Request.post('/menu/del', data)
}

export function add(data) {
  return Request.post('/menu/add', data)
}
