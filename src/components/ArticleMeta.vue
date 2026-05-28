<template>
  <div class="article-meta">
    <span>{{ formatDate(date) }}</span>
    <span v-if="readingTime">/ {{ readingTime }} 分钟阅读</span>
    <template v-if="tags?.length">
      <span>/</span>
      <div class="article-tags">
        <span v-for="tag in tags" :key="tag.slug || tag.name" class="inline-tag">
          {{ tag.name }}
        </span>
      </div>
    </template>
  </div>
</template>

<script setup>
import { formatDate } from '../lib/page'

defineProps({
  date: {
    type: String,
    default: '',
  },
  readingTime: {
    type: Number,
    default: 0,
  },
  tags: {
    type: Array,
    default: () => [],
  },
})
</script>
