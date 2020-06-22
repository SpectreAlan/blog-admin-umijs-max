import Request from '@/utils/request'

export function list(data) {
  return Request.post('/gallery/search', data)
}
export function add(data) {
  return Request.post('/gallery/add', data)
}
export function edit(data) {
  return Request.post('/gallery/edit', data)
}
export function del(data) {
  return Request.post('/gallery/del', data)
}
export function status(data) {
  return Request.post('/gallery/status', data)
}
