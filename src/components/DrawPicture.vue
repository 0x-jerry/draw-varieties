<script lang="ts" setup>
import { getImageData } from '@/utils'

defineProps<{
  url: string
}>()

const $canvas = ref<HTMLCanvasElement>()

const $img = ref<HTMLImageElement>()

function startDraw() {
  if (!$img.value || !$canvas.value) return

  const data = getImageData($img.value, 0.5)
  draw(data)
}

function draw(data: Uint8ClampedArray) {
  const colors: number[][] = []

  for (let i = 0; i < data.length; i += 4) {
    const color = [data[i], data[i + 1], data[i + 2]]
    colors.push(color)
  }

  console.log(colors.length)
}
</script>

<template>
  <div flex="~" grid="gap-x-4">
    <img ref="$img" :src="url" width="200" />
    <canvas ref="$canvas" border="~ solid gray-200"></canvas>
  </div>

  <div m="t-2">
    <k-button @click="startDraw">Start Draw</k-button>
  </div>
</template>

<style></style>
