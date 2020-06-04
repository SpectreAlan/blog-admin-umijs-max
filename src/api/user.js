import Request from '@/utils/request'

export function login(data) {
  return Request.post('/login', data)
}

export function getInfo(token) {
  return Request.post('/userInfo', { token })
}

export function logout() {
  return Request.post('/logout')
}
