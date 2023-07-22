import { mainApi } from 'shared/api'
import { computed, ref } from 'vue'

export const progress = ref(-1)
export const outputPath = ref<string | null>(null)

const startTime = ref(0)
const endTime = ref(1)

export const elapsed = computed(() => Math.round(endTime.value - startTime.value))

mainApi.onProgress((value) => {
  progress.value = value
  mainApi.showProgress(value)
})

export const encode = async (filePath: string, audioIds: number[], subtitleIds: number[]) => {
  console.log('encode', filePath, audioIds, subtitleIds)
  outputPath.value = await mainApi.openDirectory()

  console.log('start encoding', Date.now())
  startTime.value = Date.now() / 1000
  progress.value = 0

  await mainApi.convert(filePath, audioIds, subtitleIds, outputPath.value!)

  console.log('end encoding', Date.now())
  endTime.value = Date.now() / 1000
  progress.value = 101
  mainApi.showProgress(-1)
}
