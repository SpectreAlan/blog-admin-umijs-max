import Request from '@/utils/request'

export function search(data) {
  return Request.post('/category/search', data)
}
export function add(data) {
  return Request.post('/category/add', data)
}
export function edit(data) {
  return Request.post('/category/edit', data)
}
export function del(data) {
  return Request.post('/category/del', data)
}
export function belong(data) {
  return Request.post('/category/belong', data)
}
