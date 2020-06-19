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
  return Request.post('/tags/list', data)
}
export function allTags(data) {
  return Request.post('/tags/all', data)
}
export function addTags(data) {
  return Request.post('/tags/add', data)
}
export function editTags(data) {
  return Request.post('/tags/edit', data)
}
export function delTags(data) {
  return Request.post('/tags/del', data)
}
export function category(data) {
  return Request.post('/article/category', data)
}
