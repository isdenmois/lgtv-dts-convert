import { app, shell, BrowserWindow, ipcMain, dialog, OpenDialogOptions } from 'electron'
import { join, basename, dirname } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import { ffprobe } from './ffprobe'
import { convert } from './convert'

function createWindow(): void {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false,
    },
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.

ipcMain.handle('main/get-file', (): string | null => {
  if (process.platform == 'linux') {
    return process.argv[2] ?? null
  }

  return process.argv[1] ?? null
})

ipcMain.handle('main/args', (): string[] => {
  return process.argv
})

const getCurrentWindow = () => BrowserWindow.getAllWindows().find((w) => !w.isDestroyed())!

ipcMain.handle('main/openDialog', async (_, options: OpenDialogOptions) => {
  const window = getCurrentWindow()

  const { canceled, filePaths } = await dialog.showOpenDialog(window, options)

  if (canceled || !filePaths.length) {
    throw 'Not selected'
  }

  return filePaths
})

ipcMain.handle('main/openPath', (_, path: string) => {
  shell.openPath(path)
})

ipcMain.handle('main/ffprobe', (_, filePath: string): Promise<unknown> => ffprobe(filePath))

ipcMain.handle(
  'convert/start',
  ({ sender }, filePath: string, audioIds: number[], subtitleIds: number[], outputDirectory: string) => {
    return convert(filePath, audioIds, subtitleIds, outputDirectory, (percent) => {
      sender.send('convert/progress', percent)
    })
  },
)

ipcMain.handle('main/progress', (_, value: number) => {
  getCurrentWindow().setProgressBar(value)
})

ipcMain.handle('main/basename', (_, filePath: string) => basename(filePath))

ipcMain.handle('main/dirname', (_, filePath: string) => dirname(filePath))

ipcMain.handle('shell/openPath', (_, path: string) => {
  shell.openPath(path)
})
