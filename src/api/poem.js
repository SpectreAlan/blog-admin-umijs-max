import Request from '@/utils/request'

export function search(data) {
  return Request.post('/poem/search', data)
}

export function del(data) {
  return Request.post('/poem/del', data)
}
