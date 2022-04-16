<script setup lang="ts">
import { KImageUploaderUploadContext } from '@0x-jerry/vue-kit'

const img = ref('./test.png')

const upload = (ctx: KImageUploaderUploadContext) => {
  return URL.createObjectURL(ctx.file)
}
</script>

<template>
  <div p="x-4 y-6">
    <k-col>
      <k-row justify="center" align="items-end">
        <span> Choose Image: </span>
        <k-image-uploader v-model="img" :upload="upload"></k-image-uploader>
      </k-row>

      <hr m="y-4" />

      <draw-picture v-if="img" :url="img"></draw-picture>
    </k-col>
  </div>
</template>
