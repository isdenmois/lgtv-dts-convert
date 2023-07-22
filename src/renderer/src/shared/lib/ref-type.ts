import { Ref } from 'vue'

export type RefType<T> = T extends Ref<infer K> ? K : never
