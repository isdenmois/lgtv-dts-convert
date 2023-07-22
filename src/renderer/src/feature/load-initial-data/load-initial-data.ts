import { selectedFile } from 'entities/file'
import { mainApi } from 'shared/api'
import { ref } from 'vue'

export const isInitalPathLoaded = ref(false)

export const loadInitialPath = async () => {
  selectedFile.value = await mainApi.getInitialFilePath()

  isInitalPathLoaded.value = true
}
