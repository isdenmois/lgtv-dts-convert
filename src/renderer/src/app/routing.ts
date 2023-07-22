import { computed } from 'vue'
import { selectedFile } from 'entities/file'
import { isInitalPathLoaded } from 'feature/load-initial-data'
import { metadata } from 'feature/parse-metadata'
import { progress } from 'feature/encode'
import { RefType } from 'shared/lib'

export type Route = RefType<typeof route>

export const route = computed(() => {
  if (!isInitalPathLoaded.value) {
    return 'INIT'
  }

  if (!selectedFile.value) {
    return 'HOME'
  }

  if (!metadata.value) {
    return 'PARSING'
  }

  if (progress.value < 0) {
    return 'FILE_SETTINGS'
  }

  if (progress.value <= 100) {
    return 'ENCODING'
  }

  return 'DONE'
})
