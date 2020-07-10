export function recovery(key) {
  this.list = JSON.parse(localStorage.getItem(key))
}
export function copy(value) {
  const middle = document.createElement('input')
  document.body.appendChild(middle)
  middle.value = value
  middle.select()
  document.execCommand('copy')
  document.body.removeChild(middle)
  this.$message({
    duration: 600,
    message: '复制成功',
    type: 'success'
  })
}
