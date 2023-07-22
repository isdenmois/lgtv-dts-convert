<script setup lang="ts">
import { Progress } from 'shared/ui'
import { formatTime } from 'shared/lib'
import { elapsed, outputPath } from 'feature/encode'
import { mainApi } from 'shared/api'

const openFolder = async () => {
  mainApi.openPath(outputPath.value!)
}
</script>

<template>
  <div class="wrapper">
    <Progress :value="100" :size="240" :width="16" />
    <h2 class="mt-4">Success!</h2>
    <h4 class="mt-2">It took {{ formatTime(elapsed) }} to convert the file</h4>

    <button class="mt-4" @click="openFolder">Open the contain folder</button>
  </div>
</template>

<style scoped>
.wrapper {
  align-items: center;
  display: flex;
  flex-direction: column;
  flex: 1;
  justify-content: center;
}
</style>
