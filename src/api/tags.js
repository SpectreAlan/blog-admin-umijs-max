import Request from '@/utils/request'

export function search(data) {
  return Request.post('/tags/search', data)
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
export function belong(data) {
  return Request.post('/tags/belong', data)
}
