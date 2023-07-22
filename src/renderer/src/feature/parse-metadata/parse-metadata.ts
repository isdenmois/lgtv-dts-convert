import { ref, watch } from 'vue'
import { selectedFile } from 'entities/file'
import { mainApi } from 'shared/api'

export interface VideoMetadata {
  codec: string
  height: string
  width: string
  language?: string
}

export interface AudioMetadata {
  id: number
  codec?: string
  language?: string
  title?: string
  bitrate?: number
  size?: number
}

export interface SubtitleMetadata {
  id: number
  language?: string
  title?: string
  size?: number
}

export interface Metadata {
  format: string
  duration: number
  size: number
  title: string
  video: VideoMetadata
  audios: AudioMetadata[]
  subtitles: SubtitleMetadata[]
}

export const metadata = ref<Metadata | null>(null)

export const parseError = ref<string | null>(null)

watch(selectedFile, async (file) => {
  if (file) {
    const data = await mainApi.ffprobe(file)
    const fileName = await mainApi.basename(file)

    console.log(data)
    const video = data.streams.find((stream) => stream.codec_type === 'video')
    const audios = data.streams.filter((stream) => stream.codec_type === 'audio')
    const subtitles = data.streams.filter((stream) => stream.codec_type === 'subtitle')
    const title = video.tags.title || data.format.tags.title || data.format.tags.TITLE || fileName

    metadata.value = {
      // ffprobe: data,
      format: data.format.format_long_name,
      duration: Math.floor(data.format.duration),
      size: Math.floor(data.format.size),
      title,
      video: {
        // video,
        codec: video.codec_long_name,
        height: video.height,
        width: video.width,
        language: video.tags.language?.toUpperCase(),
      },
      audios: audios.map((audio, id) => ({
        // audio,
        id, //: audio.index,
        codec: audio.codec_name?.toUpperCase(),
        language: audio.tags.language?.toUpperCase(),
        title: audio.tags.title,
        bitrate: +audio.bit_rate,
        size: audio.tags.NUMBER_OF_BYTES,
      })),
      subtitles: subtitles.map((subtitle, id) => ({
        // subtitle,
        id, //: subtitle.index,
        language: subtitle.tags.language?.toUpperCase(),
        title: subtitle.tags.title,
        size: subtitle.tags.NUMBER_OF_BYTES,
      })),
    }
  }
})
