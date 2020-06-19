import Request from '@/utils/request'

export function tags(data) {
  return Request.post('/tags/list', data)
}
export function add(data) {
  return Request.post('/tags/add', data)
}
export function edit(data) {
  return Request.post('/tags/edit', data)
}
export function del(data) {
  return Request.post('/tags/del', data)
}
export function search(data) {
  return Request.post('/tags/search', data)
}
