<script setup lang="ts">
import { selectedFile } from 'entities/file'
import { FileUploader } from './ui'
</script>

<template>
  <div class="page">
    <FileUploader @select="(path) => (selectedFile = path)" />
  </div>
</template>

<style>
.page {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
