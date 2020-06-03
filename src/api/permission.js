import request from '@/utils/request'

export function list(data) {
  return request({
    url: '/users/list',
    method: 'post',
    data
  })
}

export function add(data) {
  return request({
    url: '/users/add',
    method: 'post',
    data
  })
}

export function edit(data) {
  return request({
    url: '/users/edit',
    method: 'post',
    data
  })
}

export function del(data) {
  return request({
    url: '/users/del',
    method: 'post',
    data
  })
}
