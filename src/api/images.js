import Request from '@/utils/request'

export function search(data) {
  return Request.post('/images/search', data)
}
export function add(data) {
  return Request.post('/images/add', data)
}
export function del(data) {
  return Request.post('/images/del', data)
}
