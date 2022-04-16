const canvas = document.createElement('canvas')
canvas.style.display = 'none'

document.body.append(canvas)

function getImageData(image: HTMLImageElement, imageQuality: number): ImageData {
  const w = image.naturalWidth * imageQuality
  const h = image.naturalHeight * imageQuality

  canvas.width = w
  canvas.height = h
  canvas.style.width = w + 'px'
  canvas.style.height = h + 'px'

  const ctx = canvas.getContext('2d')

  if (!ctx) {
    return [] as any
  }

  ctx.drawImage(image, 0, 0, w, h)
  const data = ctx.getImageData(0, 0, w, h)

  return data
}

export { getImageData }
