const { ipcRenderer } = window.electron

export const openPath = (path: string) => ipcRenderer.invoke('shell/openPath', path)
