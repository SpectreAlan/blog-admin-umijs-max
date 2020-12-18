import Request from '@/utils/request'

export function search() {
  return Request.post('/dashboard/search')
}

export function searchItem(data) {
  return Request.post('/dashboard/item', data)
}

export function searchBlog() {
  return Request.get('/dashboard/category')
}

export function searchCity() {
  return Request.get('/dashboard/city')
}

