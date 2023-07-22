<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  value: number
  size: number
  width: number
}>()

const percent = computed(() => Math.floor(props.value * 100) / 100)

const strokeDashoffset = computed(() => {
  const r = 90 //100 - props.width
  const c = Math.PI * r * 2
  const value = Math.min(Math.max(0, props.value), 100)

  return ((100 - value) / 100) * c
})
const stroke = computed(() => (props.value >= 100 ? 'var(--successColor)' : 'var(--progressPrimaryColor)'))
</script>

<template>
  <svg class="svg" :width="size" :height="size" viewBox="0 0 200 200" version="1.1" xmlns="http://www.w3.org/2000/svg">
    <circle
      :r="90"
      cx="100"
      cy="100"
      fill="transparent"
      stroke-dasharray="565.48"
      stroke-dashoffset="0"
      :stroke-width="width"
    />
    <circle
      class="bar"
      :r="90"
      cx="100"
      cy="100"
      fill="transparent"
      stroke-dasharray="565.48"
      stroke-dashoffset="0"
      stroke-linecap="round"
      :stroke-width="width"
      :style="{ strokeDashoffset, stroke }"
      transform="rotate(-90, 100, 100)"
    />
    <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle">{{ percent }}%</text>
  </svg>
</template>

<style scoped>
.svg {
  display: inline-block;
}

circle {
  stroke-dashoffset: 0;
  transition: stroke-dashoffset 300ms linear;
  stroke: var(--progressSecondaryColor);
}

text {
  fill: var(--textColor);
  font-size: 24px;
}
</style>
