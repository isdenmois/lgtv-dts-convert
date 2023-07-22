<script setup lang="ts">
import { mainApi } from 'shared/api'
import { icons } from 'shared/ui'

const emit = defineEmits<{
  (e: 'select', path: string)
}>()

const select = async () => {
  const path = await mainApi.openFile()

  emit('select', path)
}
</script>

<template>
  <div class="wrapper">
    <div class="icon-wrapper">
      <img :src="icons.movie" />
    </div>
    <h4 class="mt-4">Drop a file here or</h4>
    <button class="mt-2" @click="select()">Choose a file to convert</button>
  </div>
</template>

<style scoped>
.wrapper {
  display: flex;
  align-items: center;
  flex-direction: column;
}

.icon-wrapper {
  border: 2px dashed var(--textColor);
  border-radius: 24px;
  padding: 32px;
}

h4 {
  color: var(--textSecondaryColor);
}
</style>
