import { spawn } from 'child_process'

export function ffprobe(filePath: string): Promise<unknown> {
  return new Promise((resolve, reject) => {
    const proc = spawn('ffprobe', [
      '-hide_banner',
      '-loglevel',
      'fatal',
      '-show_error',
      '-show_format',
      '-show_streams',
      '-show_programs',
      '-show_chapters',
      '-show_private_data',
      '-print_format',
      'json',
      filePath,
    ])
    const probeData: string[] = []
    const errData: string[] = []
    // let exitCode = null

    proc.stdout.setEncoding('utf8')
    proc.stderr.setEncoding('utf8')

    proc.stdout.on('data', (data: string) => {
      probeData.push(data)
    })
    proc.stderr.on('data', (data: string) => {
      errData.push(data)
    })

    // proc.on('exit', (code) => {
    //   exitCode = code
    // })
    proc.on('error', (err) => reject(err))
    proc.on('close', () => resolve(JSON.parse(probeData.join(''))))
  })
}
