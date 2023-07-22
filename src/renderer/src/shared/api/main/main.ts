const { ipcRenderer } = window.electron

export const openFile = async () => {
  const paths = await ipcRenderer.invoke('main/openDialog', {
    properties: ['openFile'],
    buttonLabel: 'Select',
  })

  return Array.isArray(paths) ? paths[0] : paths
}

export const openDirectory = async () => {
  const paths = await ipcRenderer.invoke('main/openDialog', {
    properties: ['openDirectory', 'createDirectory'],
    buttonLabel: 'Select',
  })

  return Array.isArray(paths) ? paths[0] : paths
}

export const getInitialFilePath = () => ipcRenderer.invoke('main/get-file') as Promise<string | null>

export const ffprobe = (path: string) => ipcRenderer.invoke('main/ffprobe', path)

export const onProgress = (callback: (value: number) => void) =>
  ipcRenderer.on('convert/progress', (_, value) => callback(value))

export const convert = (inputPath: string, audioIds: number[], subtitleIds: number[], outputPath: string) =>
  ipcRenderer.invoke('convert/start', inputPath, audioIds, subtitleIds, outputPath)

export const showProgress = (percent: number) => ipcRenderer.invoke('main/progress', percent > 100 ? -1 : percent / 100)

export const basename = (filePath: string) => ipcRenderer.invoke('main/basename', filePath) as Promise<string>
export const dirname = (filePath: string) => ipcRenderer.invoke('main/dirname', filePath) as Promise<string>
