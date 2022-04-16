import { sleep } from '@0x-jerry/utils'

type ColorPixel = [number, number, number, number]

class Pixels {
  data: ImageData

  constructor(data: ImageData) {
    this.data = data
  }

  get width() {
    return this.data.width
  }

  get height() {
    return this.data.height
  }

  get size() {
    return this.data.width * this.data.height
  }

  get(idx: number): ColorPixel {
    const i = idx * 4

    const r = this.data.data[i]
    const g = this.data.data[i + 1]
    const b = this.data.data[i + 2]
    const a = this.data.data[i + 3]
    return [r, g, b, a]
  }

  set(idx: number, color: ColorPixel) {
    const i = idx * 4

    this.data.data[i] = color[0]
    this.data.data[i + 1] = color[1]
    this.data.data[i + 2] = color[2]
    this.data.data[i + 3] = color[3]
  }

  forEach(cb: (item: ColorPixel, idx: number) => any) {
    for (let idx = 0; idx < this.size; idx++) {
      cb(this.get(idx), idx)
    }
  }
}

//  ---------

export class Draw {
  similarity = ref(0)

  status = reactive({
    iterCount: 0,
  })

  offsets: number[] = []

  isStop = false

  ctx?: CanvasRenderingContext2D

  target = new Pixels(new ImageData(1, 1))

  real = new Pixels(new ImageData(1, 1))

  async run(ctx: CanvasRenderingContext2D, imgData: ImageData) {
    this.ctx = ctx

    this.target = new Pixels(imgData)

    const canvasData = ctx.getImageData(0, 0, this.target.width, this.target.height)

    this.real = new Pixels(canvasData)

    // let min = 0
    // let max = 0
    this.real.forEach((c, idx) => {
      const offset = evaluatePixelOffset(c, this.target.get(idx))
      const percent = (1 / this.real.size) * (1 - offset / (255 * 2))
      this.similarity.value += percent
      this.offsets.push(offset)
    })

    this.status.iterCount = 0
    this.continue()
  }

  stop() {
    this.isStop = true
  }

  toggle() {
    if (this.isStop) {
      this.continue()
    } else {
      this.stop()
    }
  }

  async continue() {
    this.isStop = false

    while (this.status.iterCount++ < 100000) {
      if (this.isStop) {
        break
      }
      this.drawImage()
      await sleep(10)
    }
  }

  drawImage() {
    const ctx = this.ctx!
    this.target.forEach((pixel, idx) => {
      const p = randomPixel()
      const offset = evaluatePixelOffset(p, pixel)

      if (offset < this.offsets[idx]) {
        const percentOffset = (1 / this.target.size) * (offset - this.offsets[idx] / (255 * 2))

        this.similarity.value += percentOffset
        this.offsets[idx] = offset
        this.real.set(idx, p)
      }
    })

    ctx.putImageData(this.real.data, 0, 0)
  }
}

function randomPixel() {
  const r = () => Math.floor(Math.random() * 256)

  const pixel: ColorPixel = [r(), r(), r(), r()]

  return pixel
}

function evaluatePixelOffset(from: ColorPixel, to: ColorPixel, len = 3) {
  let offset = 0

  for (let idx = 0; idx < len; idx++) {
    const p1 = from[idx]
    const p2 = to[idx]
    offset += Math.abs(p1 - p2)
  }

  return offset
}
