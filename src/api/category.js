import Request from '@/utils/request'

export function category(data) {
  return Request.post('/category/list', data)
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
export function search(data) {
  return Request.post('/category/search', data)
}
