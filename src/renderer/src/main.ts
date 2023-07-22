import { createApp } from 'vue'
import 'virtual:uno.css'
import './shared/ui'
import { loadInitialPath } from 'feature/load-initial-data'
import { App } from './app'

loadInitialPath()

createApp(App).mount('#app')
