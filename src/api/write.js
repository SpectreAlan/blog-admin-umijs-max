import Request from '@/utils/request'

export function tags() {
  return Request.post('/tags/search/all')
}

export function category(data) {
  return Request.post('/category/search/all', data)
}

export function detail(data) {
  return Request.post('/article/search/one', data)
}

export function add(data) {
  return Request.post('/article/add', data)
}

export function edit(data) {
  return Request.post('/article/edit', data)
}
