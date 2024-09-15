// ffmpeg -i input.mkv -map 0 -c:v copy -c:a ac3 -c:s copy output.mkv
import ffmpeg from 'fluent-ffmpeg'
import path, { basename } from 'path'

if (process.platform === 'win32') {
  ffmpeg.setFfmpegPath('ffmpeg.exe')
  ffmpeg.setFfprobePath('ffprobe.exe')
}

export function convert(
  filePath: string,
  audioIds: number[],
  subtitleIds: number[],
  outputDirectory: string,
  onProgress: (percent: number) => void,
): Promise<string> {
  const fileName = basename(filePath)
  const output = path.join(outputDirectory, fileName)

  if (filePath === output) {
    throw 'Can\t overwrite the file'
  }

  const audios = audioIds.flatMap((id) => ['-map', `0:a:${id}`])
  const subtitles = subtitleIds.flatMap((id) => ['-map', `0:s:${id}`])

  return new Promise((resolve, reject) => {
    ffmpeg(filePath)
      .outputOptions(
        '-map',
        '0:v',
        ...subtitles,
        ...audios,
        '-c:v',
        'copy',
        '-c:s',
        'copy',
        '-c:a',
        'libopus',
        '-b:a',
        '128k',
        '-af',
        'pan=stereo|c0=c2+0.30*c0+0.30*c4|c1=c2+0.30*c1+0.30*c5',
      )
      .on('start', function (commandLine) {
        console.log('Spawned Ffmpeg with command: ' + commandLine)
      })
      .on('progress', ({ percent }) => {
        console.log('progress ' + percent + '%')
        onProgress(percent)
      })
      .on('end', () => {
        onProgress(101)
        resolve(output)
      })
      .on('error', reject)
      .save(output)
  })
}
