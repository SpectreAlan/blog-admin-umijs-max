import Request from '@/utils/request'

export function list(data) {
  return Request.post('/basic/search', data)
}
export function edit(data) {
  return Request.post('/basic/edit', data)
}
export function add(data) {
  return Request.post('/basic/add', data)
}
