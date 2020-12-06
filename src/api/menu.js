import Request from '@/utils/request'

export function menu(type, data) {
  return Request.post('/menu/' + type, data)
}

export function types(data) {
  return Request.post('/menu/search/types', data)
}
