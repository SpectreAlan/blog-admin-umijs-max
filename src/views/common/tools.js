export function emitEvent(args) {
  const { data, fn } = args
  if (typeof this[fn] === 'function') {
    this[fn](data)
  }
}
export function canvasDataURL(path, options, callback) {
  const img = new Image()
  img.src = path
  img.onload = function() {
    const that = this
    let w = that.width
    let h = that.height
    const scale = w / h
    w = options.width || w
    h = options.height || (w / scale)
    let quality = 0.7
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    const anw = document.createAttribute('width')
    anw.nodeValue = w
    const anh = document.createAttribute('height')
    anh.nodeValue = h
    canvas.setAttributeNode(anw)
    canvas.setAttributeNode(anh)
    ctx.drawImage(that, 0, 0, w, h)
    if (options.quality && options.quality <= 1 && options.quality > 0) {
      quality = options.quality
    }
    const base64 = canvas.toDataURL(options.type === 'image/png' ? 'image/png' : 'image/jpeg', quality)
    callback(base64)
  }
}

export function photoCompress(file, options, callback) {
  const ready = new FileReader()
  ready.readAsDataURL(file)
  ready.onload = function() {
    const path = this.result
    canvasDataURL(path, options, callback)
  }
}

export function base64ToBlob(data) {
  const arr = data.split(','); const mime = arr[0].match(/:(.*?);/)[1]
  const bstr = atob(arr[1]); let n = bstr.length; const u8arr = new Uint8Array(n)
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n)
  }
  return new Blob([u8arr], { type: mime })
}
