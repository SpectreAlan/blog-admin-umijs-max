import Request from '@/utils/request'

export function list(data) {
  return Request.post('/settings/list', data)
}
export function edit(data) {
  return Request.post('/settings/edit', data)
}
export function add(data) {
  return Request.post('/settings/add', data)
}
