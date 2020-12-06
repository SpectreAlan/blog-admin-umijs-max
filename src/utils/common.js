
import { Message } from 'element-ui'

export function copy(text) {
  const middle = document.createElement('input')
  document.body.appendChild(middle)
  middle.value = text
  middle.select()
  document.execCommand('copy')
  document.body.removeChild(middle)
  Message({
    duration: 600,
    message: '复制成功',
    type: 'success'
  })
}
