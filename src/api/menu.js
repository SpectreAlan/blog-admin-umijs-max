import Request from '@/utils/request'

export function search(data) {
  return Request.post('/menu/search', data)
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

export function types(data) {
  return Request.post('/menu/search/types', data)
}
