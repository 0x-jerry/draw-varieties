<script lang="ts" setup>
import { getImageData } from '@/utils'
import { Draw } from './draw'

defineProps<{
  url: string
}>()

const draw = new Draw()

const $canvas = ref<HTMLCanvasElement>()

const $img = ref<HTMLImageElement>()

const style = reactive({
  width: '100px',
  height: '100px',
})

function startDraw() {
  if (!$img.value || !$canvas.value) return
  const ctx = $canvas.value.getContext('2d')!

  const data = getImageData($img.value, 0.5)

  $canvas.value.width = data.width
  $canvas.value.height = data.height
  style.width = data.width + 'px'
  style.height = data.height + 'px'

  draw.run(ctx, data)
}
</script>

<template>
  <div flex="~" grid="gap-x-4">
    <img ref="$img" :src="url" :style="style" />
    <canvas ref="$canvas" border="~ solid gray-200" :style="style"></canvas>
  </div>

  <k-row m="t-2">
    <k-button @click="startDraw">Init and Start Draw</k-button>
    <k-button @click="draw.toggle()">Toggle Draw</k-button>
    {{ draw.status.iterCount }} |
    {{ draw.similarity.value.toFixed(2) }}
  </k-row>
</template>

<style></style>
