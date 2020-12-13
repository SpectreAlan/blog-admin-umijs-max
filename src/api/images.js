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
export function upload(data) {
  return Request.post('/uploads/images', data, { headers: {
    'Content-Type': 'multipart/form-data' }
  })
}
