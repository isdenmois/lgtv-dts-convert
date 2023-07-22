<script setup lang="ts">
import { ref } from 'vue'
import { selectedFile } from 'entities/file'
import { metadata } from 'feature/parse-metadata'
import { encode } from 'feature/encode'

const format = (...args: Array<string | number | null | undefined>) => args.filter(Boolean).join(' • ')

const cancel = () => {
  selectedFile.value = null
}

const audiosSelected = ref(
  new Set<number>(metadata.value?.audios.filter((audio) => audio.language === 'ENG').map((audio) => audio.id) ?? []),
)

const subtitlesSelected = ref(
  new Set<number>(
    metadata.value?.subtitles.filter((subtitle) => subtitle.language === 'ENG').map((subtitle) => subtitle.id) ?? [],
  ),
)

const toggle = (set: Set<number>, id: number) => {
  if (set.has(id)) {
    set.delete(id)
  } else {
    set.add(id)
  }
}
</script>

<template>
  <div class="content">
    <div v-if="metadata" class="card mt-4">
      <h1>{{ metadata.title }}</h1>
      <h2>{{ format(metadata.video.language, metadata.duration, metadata.size) }}</h2>
      <h2>{{ format(`${metadata.video.width}x${metadata.video.height}`, metadata.format) }}</h2>
      <h2>{{ metadata.video.codec }}</h2>
    </div>

    <div v-if="metadata?.audios?.length" class="card mt-4">
      <h2>Audio tracks</h2>
      <ul>
        <li v-for="audio of metadata.audios" :key="audio.id">
          <label>
            <input type="checkbox" :checked="audiosSelected.has(audio.id)" @change="toggle(audiosSelected, audio.id)" />
            <div>
              <h2>{{ audio.title ?? audio.language }}</h2>
              <h3>
                {{ format(audio.codec, audio.language, audio.bitrate, audio.size) }}
              </h3>
            </div>
          </label>
        </li>
      </ul>
    </div>

    <div v-if="metadata?.subtitles?.length" class="card mt-4">
      <h2>Closed Captions</h2>
      <ul>
        <li v-for="subtitle of metadata.subtitles" :key="subtitle.id">
          <label>
            <input
              type="checkbox"
              :checked="subtitlesSelected.has(subtitle.id)"
              @change="toggle(subtitlesSelected, subtitle.id)"
            />
            <div>
              <h2>{{ subtitle.title ?? subtitle.language }}</h2>
              <h3>
                {{ format(subtitle.language, subtitle.size) }}
              </h3>
            </div>
          </label>
        </li>
      </ul>
    </div>
  </div>

  <div class="card footer mt-4">
    <div class="settings"></div>
    <div></div>

    <div class="buttons">
      <button class="secondary" @click="cancel">Cancel</button>
      <button @click="encode(selectedFile!, [...audiosSelected], [...subtitlesSelected])">Start encoding</button>
    </div>
  </div>
</template>
<style scoped>
.footer {
  display: flex;
  justify-content: space-between;
  position: sticky;
  bottom: 0;
}

ul {
  padding: 0;
  list-style-type: none;
}

label {
  display: flex;
  cursor: pointer;
  gap: 16px;
}

.buttons {
  display: flex;
  gap: 16px;
}
</style>
