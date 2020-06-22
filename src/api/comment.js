import Request from '@/utils/request'

export function comments(data) {
  return Request.post('/comment/search', data)
}
export function add(data) {
  return Request.post('/comment/add', data)
}
export function status(data) {
  return Request.post('/comment/status', data)
}
export function del(data) {
  return Request.post('/comment/del', data)
}
