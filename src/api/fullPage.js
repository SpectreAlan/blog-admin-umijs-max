import Request from '@/utils/request'

export function search(data) {
  return Request.post('/fullPage/search', data)
}

export function del(data) {
  return Request.post('/fullPage/del', data)
}
