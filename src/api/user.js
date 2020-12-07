import Request from '@/utils/request'

export function login(data) {
  return Request.post('/user/login', data)
}

export function changeThemeReq(data) {
  return Request.post('/user/theme', data)
}

export function getInfo() {
  return Request.post('/user/info')
}

export function logout() {
  return Request.post('user/logout')
}
