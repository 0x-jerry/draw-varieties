<script lang="ts" setup>
import { getImageData } from '@/utils'
import { Draw } from './draw'

defineProps<{
  url: string
}>()

const data = reactive({
  quality: 1,
})

const draw = new Draw()

const $canvas = ref<HTMLCanvasElement>()

const $img = ref<HTMLImageElement>()

const style = reactive({
  width: '100px',
  height: '100px',
})

onMounted(() => {
  draw.stop()
})

function startDraw() {
  if (!$img.value || !$canvas.value) return
  const ctx = $canvas.value.getContext('2d')!

  const imgData = getImageData($img.value, data.quality)

  const w = imgData.width
  const h = imgData.height

  $canvas.value.width = w
  $canvas.value.height = h
  style.width = (w < 100 ? 100 : w) + 'px'
  style.height = 'auto'
  ctx.clearRect(0, 0, w, h)

  draw.run(ctx, imgData)
}
</script>

<template>
  <k-row m="b-2" justify="center" align="items-center">
    <input v-model.number="data.quality" type="range" step="0.01" min="0.01" max="1" />
    {{ data.quality }}
    <k-button @click="startDraw">Start</k-button>
    <k-button @click="draw.toggle()">{{ draw.isStop.value ? 'Continue' : 'Stop' }}</k-button>
    <span w="50px"> {{ draw.status.iterCount }} </span>
    <!-- | -->
    <span w="50px">
      <!-- {{ draw.similarity.value.toFixed(2) }} -->
    </span>
  </k-row>

  <k-row justify="center">
    <img ref="$img" :src="url" :style="style" />
    <canvas ref="$canvas" border="~ solid gray-200" :style="style"></canvas>
  </k-row>
</template>

<style></style>
