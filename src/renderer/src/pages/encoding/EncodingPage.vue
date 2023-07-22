<script setup lang="ts">
import { ref, onBeforeUnmount, computed } from 'vue'
import { progress } from 'feature/encode'
import { Progress } from 'shared/ui'
import { formatTime } from 'shared/lib'
import { metadata } from 'feature/parse-metadata'

const start = Date.now()
const time = ref(0)

const timeout = setInterval(() => {
  time.value = Math.floor((Date.now() - start) / 1000)
}, 500)

onBeforeUnmount(() => {
  clearInterval(timeout)
})

const eta = computed(() => (time.value / progress.value) * 100)
</script>

<template>
  <div class="wrapper">
    <Progress :value="progress" :size="240" :width="16" />
    <h2 class="mt-4">Converting...</h2>
    <h4 v-if="metadata" class="mt-2">{{ metadata.title }}</h4>
    <h4 class="mt-2">
      <span>{{ formatTime(time) }}</span>
      <span v-if="progress > 0"> / {{ formatTime(eta) }}</span>
    </h4>
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
