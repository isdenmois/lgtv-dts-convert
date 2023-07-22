<script setup lang="ts">
import { type Component } from 'vue'
import { HomePage } from 'pages/home'
import { FileSettingsPage } from 'pages/file-settings'
import { InitPage } from 'pages/init'
import { DonePage } from 'pages/done'
import { EncodingPage } from 'pages/encoding'
import { ParsingPage } from 'pages/parsing'
import { route, type Route } from './routing'

const router: Record<Route, Component> = {
  INIT: InitPage,
  HOME: HomePage,
  FILE_SETTINGS: FileSettingsPage,
  PARSING: ParsingPage,
  ENCODING: EncodingPage,
  DONE: DonePage,
}
</script>

<template>
  <component :is="router[route]" />
</template>
